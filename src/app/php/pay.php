<?php
// 为避免它们的变更引发问题，应该用适配器模式包装起来，提供应用统一的引用方式。

/**
 * 适配器接口，所有的支付适配器都需实现这个接口。
 * 不管第三方支付实现方式如何，对于客户端来说，都
 * 用pay()方法完成支付
 */
interface PayAdapter
{
    public function pay();
    public function payResult();
}

/**
 * 支付宝适配器
 */
class AlipayAdapter implements PayAdapter
{
    public function pay()
    {
        // 实例化Alipay类，并用Alipay的方法实现支付
        $alipay = new Alipay();
        $alipay->sendPayment();
    }
}
