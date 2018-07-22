package jehc.paymodules.paypal.api;


import java.awt.image.BufferedImage;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.locks.Lock;

import org.apache.http.Header;
import org.apache.http.entity.ContentType;
import org.apache.http.message.BasicHeader;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import jehc.paymodules.base.dao.PayConfigDao;
import jehc.paymodules.base.model.CurType;
import jehc.paymodules.base.model.MethodType;
import jehc.paymodules.base.model.PayMessage;
import jehc.paymodules.base.model.PayOrder;
import jehc.paymodules.base.model.PayOutMessage;
import jehc.paymodules.base.model.RefundOrder;
import jehc.paymodules.base.model.TransactionType;
import jehc.paymodules.base.service.impl.PayServiceImpl;
import jehc.paymodules.base.util.exception.PayErrorException;
import jehc.paymodules.base.util.exception.entity.PayException;
import jehc.paymodules.base.util.http.HttpHeader;
import jehc.paymodules.base.util.http.HttpStringEntity;
import jehc.paymodules.base.util.str.StringUtils;
import jehc.paymodules.paypal.bean.PayPalTransactionType;
import jehc.paymodules.paypal.bean.order.Amount;
import jehc.paymodules.paypal.bean.order.Links;
import jehc.paymodules.paypal.bean.order.Payer;
import jehc.paymodules.paypal.bean.order.Payment;
import jehc.paymodules.paypal.bean.order.RedirectUrls;
import jehc.paymodules.paypal.bean.order.Transaction;
/**
 * 贝宝支付配置存储
 * @author Administrator
 *
 */
public class PayPalPayService extends PayServiceImpl{
    /**
     * 沙箱环境
     */
    private static final String SANDBOX_REQ_URL = "https://api.sandbox.paypal.com/v1/";
    /**
     * 正式测试环境
     */
    private static final String REQ_URL = "https://api.paypal.com/v1/";

    /**
     * 获取对应的请求地址
     * @return 请求地址
     */
    public String getReqUrl(TransactionType transactionType){
        return (payConfigDao.isTest() ? SANDBOX_REQ_URL : REQ_URL) + transactionType.getMethod();
    }


    public PayPalPayService(PayConfigDao payConfigDao) {
        super(payConfigDao);
    }

    /**
     * 获取请求token
     * @return 授权令牌
     */
    public String getAccessToken()  {
        try {
            return getAccessToken(false);
        } catch (PayErrorException e) {
            throw e;
        }
    }

    /**
     *  获取授权令牌
     * @param forceRefresh 是否重新获取， true重新获取
     * @return 新的授权令牌
     * @throws PayErrorException 支付异常
     */
    public String getAccessToken(boolean forceRefresh) throws PayErrorException {
        Lock lock = payConfigDao.getAccessTokenLock();
        try {
            lock.lock();
            if (forceRefresh) {
                payConfigDao.expireAccessToken();
            }
            if (payConfigDao.isAccessTokenExpired()) {
                if (null == payConfigDao.getAccessToken()){
                    Map<String, String> header = new HashMap<>();
                    header.put("Authorization", "Basic " + authorizationString(getPayConfigDao().getAppid(), getPayConfigDao().getKeyPrivate()));
                    header.put("Accept", "application/json");
                    header.put("Content-Type", "application/x-www-form-urlencoded");
                    try {
                        HttpStringEntity entity = new HttpStringEntity("grant_type=client_credentials", header);
                        JSONObject resp = getHttpRequestTemplate().postForObject(getReqUrl(PayPalTransactionType.AUTHORIZE), entity, JSONObject.class);
                        payConfigDao.updateAccessToken(String.format("%s %s", resp.getString("token_type" ), resp.getString("access_token" )), resp.getLongValue("expires_in" ));

                    } catch (UnsupportedEncodingException e) {
                        throw new PayErrorException(new PayException("failure", e.getMessage()));
                    }
                }
                return payConfigDao.getAccessToken();
            }
        } finally {
            lock.unlock();
        }
        return payConfigDao.getAccessToken();
    }

    public boolean verify(Map<String, Object> params) {
        HttpStringEntity httpEntity = new HttpStringEntity("{\"payer_id\":\""+(String)params.get("PayerID")+"\"}", ContentType.APPLICATION_JSON);
        httpEntity.setHeaders(authHeader());
        JSONObject resp = getHttpRequestTemplate().postForObject(String.format(getReqUrl(PayPalTransactionType.EXECUTE), (String) params.get("paymentId")), httpEntity, JSONObject.class);
        return  "approved".equals(resp.getString("state"));
    }

    public boolean signVerify(Map<String, Object> params, String sign) {
        return true;
    }

    public boolean verifySource(String id) {
        return true;
    }

    /**
     * 获取授权请求头
     * @return 授权请求头
     */
    private HttpHeader authHeader(){
        List<Header> headers = new ArrayList<>();
        headers.add(new BasicHeader("Authorization", getAccessToken()));
        headers.add(new BasicHeader("PayPal-Request-Id", UUID.randomUUID().toString()));
        return new HttpHeader(headers);
    }
    /**
     * 返回创建的订单信息
     * @param order 支付订单
     * @return 订单信息
     * @see PayOrder 支付订单信息
     */
    public Map<String, Object> orderInfo(PayOrder order) {
        Amount amount = new Amount();
        if (null == order.getCurType()){
            order.setCurType(CurType.USD);
        }
        amount.setCurrency(order.getCurType().name());
        amount.setTotal(order.getPrice().setScale(2, BigDecimal.ROUND_HALF_UP).toString());

        Transaction transaction = new Transaction();
        if (!StringUtils.isEmpty(order.getSubject())){
            transaction.setDescription(order.getSubject());
        }else {
            transaction.setDescription(order.getBody());
        }
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");

        Payment payment = new Payment();
        payment.setIntent(order.getTransactionType().getType());
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        RedirectUrls redirectUrls = new RedirectUrls();
        //取消按钮转跳地址
        redirectUrls.setCancelUrl(payConfigDao.getNotifyUrl());
        //发起付款后的页面转跳地址
        redirectUrls.setReturnUrl(payConfigDao.getReturnUrl());
        payment.setRedirectUrls(redirectUrls);
        HttpStringEntity entity = new HttpStringEntity(JSON.toJSONString(payment),  ContentType.APPLICATION_JSON);
        entity.setHeaders(authHeader());
        JSONObject resp = getHttpRequestTemplate().postForObject(getReqUrl(order.getTransactionType()), entity, JSONObject.class);
        return resp;
    }

    public PayOutMessage getPayOutMessage(String code, String message) {
        return PayOutMessage.TEXT().content(code).build();
    }

    public PayOutMessage successPayOutMessage(PayMessage payMessage) {
        return PayOutMessage.TEXT().content("success").build();
    }

    public String buildRequest(Map<String, Object> orderInfo, MethodType method) {
        if (orderInfo instanceof  JSONObject){
            Payment payment = ((JSONObject) orderInfo).toJavaObject(Payment.class);
            for(Links links : payment.getLinks()){
                if(links.getRel().equals("approval_url")){
                    return String.format("<script type=\"text/javascript\">location.href=\"%s\"</script>",links.getHref() );
                }
            }
        }
     return "<script type=\"text/javascript\">location.href=\"/\"</script>" ;
    }

    public BufferedImage genQrPay(PayOrder order) {
        return null;
    }

    public Map<String, Object> microPay(PayOrder order) {
        return null;
    }
    /**
     * 交易查询接口
     * @param tradeNo    支付平台订单号
     * @param outTradeNo 商户单号
     * @return 返回查询回来的结果集，支付方原值返回
     */
    public Map<String, Object> query(String tradeNo, String outTradeNo) {
        JSONObject resp = getHttpRequestTemplate().getForObject(String.format(getReqUrl(PayPalTransactionType.ORDERS), tradeNo), authHeader(), JSONObject.class);
        return resp;
    }

    public Map<String, Object> close(String tradeNo, String outTradeNo) {
        return null;
    }
    /**
     * 申请退款接口
     * 废弃
     * @param tradeNo    支付平台订单号
     * @param outTradeNo 商户单号
     * @param refundAmount 退款金额
     * @param totalAmount 总金额
     * @return 返回支付方申请退款后的结果
     * @see #refund(RefundOrder)
     */
    @Deprecated
    public Map<String, Object> refund(String tradeNo, String outTradeNo, BigDecimal refundAmount, BigDecimal totalAmount) {
        return refund(new RefundOrder( tradeNo,  outTradeNo,  refundAmount,  totalAmount));
    }
    /**
     * 申请退款接口
     * @param refundOrder   退款订单信息
     * @return 返回支付方申请退款后的结果
     */
    public Map<String, Object> refund(RefundOrder refundOrder) {
        JSONObject request =  new JSONObject();
        if (null != refundOrder.getRefundAmount() && BigDecimal.ZERO.compareTo( refundOrder.getRefundAmount()) > 0){
            Amount amount = new Amount();
            amount.setCurrency(refundOrder.getCurType().name());
            amount.setTotal(refundOrder.getRefundAmount().toString());
            request.put("amount", amount);
            request.put("description", refundOrder.getDescription());
        }
        HttpStringEntity httpEntity = new HttpStringEntity(request, ContentType.APPLICATION_JSON);
        httpEntity.setHeaders(authHeader());
        JSONObject resp = getHttpRequestTemplate().postForObject(String.format(getReqUrl(PayPalTransactionType.REFUND), refundOrder.getTradeNo()), httpEntity, JSONObject.class);
        return resp;
    }
    /**
     * 查询退款
     * @param tradeNo    支付平台订单号
     * @param outTradeNo 商户单号
     * @return 返回支付方查询退款后的结果
     */
    public Map<String, Object> refundquery(String tradeNo, String outTradeNo) {
        JSONObject resp = getHttpRequestTemplate().getForObject(String.format(getReqUrl(PayPalTransactionType.REFUND_QUERY), tradeNo), authHeader(), JSONObject.class);
        return resp;
    }
    public Map<String, Object> downloadbill(Date billDate, String billType) {
        return null;
    }
    public Map<String, Object> secondaryInterface(Object tradeNoOrBillDate, String outTradeNoBillType, TransactionType transactionType) {
        return null;
    }
}