<?php
class Singleton
{
    private static $_instance; //私有化静态属性
    private function __construct()
    {
        //私有化构造方法
    }
    private function __clone()
    {
        //私有化克隆方法
    }
    //静态方法产生对象
    public static function getInstance()
    {
        //对象不存在new一个对象
        if (!is_object(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$obj;
    }
}
