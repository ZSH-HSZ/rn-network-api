// 没有加入超时和取消请求
const road = {
  // 两个地址 所以写了两个地址
  development: {
    default: 'https://',
    alternative: 'https://',
  },
  production: {
    default: 'https://',
    alternative: 'https://'
  }
};
const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const baseUrl = road[process.env.NODE_ENV];
const parseUrl = (url, params) => {
	return (
		url &&
		url.replace(/\{(\w+)\}/g, (m, n) => {
			return params[n];
		})
	)
}

const apis = {
  test: '/test/{id}'  
};

function catcher(err) {
	return Promise.reject({ err });
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 400) {
		if(response._bodyInit==='') {
			response._bodyInit = '1'
			response._bodyText = '1'
			return response
		}else {
			return response
		}
	}else {
		return Promise.reject({ err: response.status });
	}
}

export const [get, post, put, del, patch] = methods.map(action => {
	return (data) => {
		return new Promise((resolve, reject)=> {
			request(action, data)
			.then(checkStatus)
			.then(res=>{
				status = true
				return res.json()
			})
			.then(response => {
				resolve (response)
			})
			.catch(catcher => {
				status = true
				reject (catcher)
			});
		})
	}
		
});

const serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)&&obj[p]) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

/**
 * @param {*} road api对象中的路径
 * @param {*} data api的{}中的参数
 * @param {*} method 方法， get, post...
 * @param {*} params query 中的参数
 * @param {*} path 两个路径中的一个，默认是default
 * @returns baseUrl[path] 地址 parseUrl(apis[road], data) 具体路径进行匹配 serialize(params) 对query进行拼接
 */
const reqRoad = (road, data, method, params, path) => {
  if (method === 'GET' && params) {
    return baseUrl[path] + parseUrl(apis[road], data) + '?' + serialize(params)
  } else {
    return baseUrl[path] + parseUrl(apis[road], data)
  }
};

/**
 * @param {*} data.road api对象中的路径
 * @param {*} data.data api的{}中的参数
 * @param {*} data.method 方法， get, post...
 * @param {*} data.params query 中的参数
 * @param {*} data.path 两个路径中的一个，默认是default
 * @returns baseUrl[path] 地址 parseUrl(apis[road], data) 具体路径进行匹配 serialize(params) 对query进行拼接
 */
function request(method, data) {
  // console.log(reqRoad(data.road, data.data, method, data.params, data.path || 'default'))
	if(data.road in apis) {
		return fetch(reqRoad(data.road, data.data, method, data.params, data.path || 'default'), {
			method,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: method!=='GET'?JSON.stringify(data.params):null
		});
	}else {
    // 未在api中匹配到
		console.error('检查参数')
	}
}