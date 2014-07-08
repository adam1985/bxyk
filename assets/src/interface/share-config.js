define(['jquery'], function($){
    return {"common": {
        "bdMini": 2,
        "bdPopupOffsetTop": 0,
        "onBeforeClick": function(cmd, config) {
            if( _bd_share_config.shareConfig ) {
                return $.extend(config, _bd_share_config.shareConfig);
            }
            
        }
    }, "share": [
        {
            "bdSize": 24
        }
    ], "selectShare": [
        {
            "bdSelectMiniList": ["weixin", "tsina", "tqq", "qzone", "tqf", "sqq", "renren", "baidu"]
        }
    ]}

});


