let basicParams = {
	g_tk: 1604785682,
	uin: 494873674,
	format: 'jsonp',
	inCharset: 'utf-8',
	outCharset: 'utf-8',
	notice: 0,
	platform:'h5',
	needNewCode: 1,
	_: new Date().getTime()
};

// ...basicParams 获取对象中所有属性以队列形式输出
let apiList = {
	// 音乐排行榜APi
	topList: {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
		params: basicParams
	},
	// 流行指数歌曲API
	rankList: {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
		params: {
			...basicParams,
			type: 'top',
			page: 'detail',
			tpl: 3
		}
	},
	// 推荐列表歌曲API
	recommend: {
		url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
		params: {
			...basicParams,
			pic: 500,
			json: 1,
			type: 1,
			utf8: 1,
			nosign: 1,
			onlysong: 0,
			nosign: 1
		}
	},
	// 首页数据Api
	indexMsg: {
		url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
		params: {
			...basicParams
		}
	},
	// 热词搜索Api
	hotkey: {
		url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
		params: {
			...basicParams
		}
	},
	// 搜索API 
	search: {
		url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
		params: {
			...basicParams,
			is_xml: 0
		}
	},
	// 全部歌手列表数据ApI
	singerlist: {
		url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
		params: {
			...basicParams,
			page: 'list',
			channel: 'singer',
			pagesize: 100,
			hostUin: 0,
			needNewCode: 0,
			pagenum: 1
		}
	},
	// 歌手API
	singer: {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
		params: {
			...basicParams,
			begin: 0,
			num: 30,
			order: 'listen',
			from: 'h5',
			songstatus: 1
		}
	}
};

/**
 * [组装地址函数]
 * @param  {[type]} options [url, params]
 * @return {[type]}         [description]
 */
export function getEncodingUrl(options) {
	let queryString = '',
		url = options.url,
		uniqueName = 'jsonp' + new Date().getTime(),
		urlParams = {...options.params, jsonpCallback: uniqueName};  

	for (let key in urlParams) {
	    if (queryString) {
	        queryString += "&";
	    }
	    // 转码
	    queryString += key + "=" + encodeURIComponent(urlParams[key]);
	}
	return {
		url: url + '?' + queryString,
		jsonpCallback: uniqueName
	};
}

/**
 * [jsonp 跨域请求函数]
 * @param  {[type]}   urlObj   [组装后的url, jsonpCallback]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function jsonp(urlObj, callback) {
    let url = urlObj.url,
    	callbackName = urlObj.jsonpCallback;
    // 移除script标签
    window[callbackName] = function(data) {
        window[callbackName] = undefined;
        document.body.removeChild(script);
        callback(data);
    };
    
    let script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}

export function apiHandler(api, callback) {
	/**
	 * Object.assign(target, ...sources) 
	 * 方法用于将所有可枚举的属性的值从一个或多个源对象复制
	 * 到目标对象，不破坏原对象，它将返回目标对象。
	 *
	 * apiList[api.name].param = Object.assign({}, apiList[
	 * api.name].params, api.params), apiList[api.name]
	 * 返回修改param后的apiList[api.name]
	 */
	return jsonp(getEncodingUrl(typeof api === "string" ? apiList[api] : (apiList[api.name].params = Object.assign({}, apiList[api.name].params, api.params), apiList[api.name])), callback);
}
