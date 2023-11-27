const getCDNs = (...url) => {
  return [
    ...url
      .filter(Boolean)
      .map(value =>
        /^(https?|ftp):\/\/[^\s/$.?#].\S*$/.test(value)
          ? value
          : `${window.location.origin}${value}`
      ),
    `${window.PUBLIC_URL}/vconsole/@3.15.1/vconsole.min.js?key=VConsole`.replace('//', '/'),
    `https://cdn.jsdelivr.net/npm/vconsole@3.15.1/dist/vconsole.min.js`,
    `https://unpkg.com/vconsole@3.15.1/dist/vconsole.min.js`,
  ];
};

export default async config => {
  const useDebugConfig =
    typeof config.debug === 'string'
      ? { enabled: true, load: config.debug }
      : config.debug && typeof config.debug === 'object'
      ? config.debug
      : { enabled: !!config.debug };

  const debug = getURLSearchParams(window.location.href, 'debug');
  const debug2 = getURLSearchParams(window.location.href, 'jxyl');
  if (useDebugConfig.enabled || debug != null || debug2 != null) {
    return loadCDNs(getCDNs(useDebugConfig.load, debug, debug2)).then(
      obj => new (obj ?? window[useDebugConfig?.key ?? 'VConsole'])(useDebugConfig.options ?? {})
    );
  }
  return null;
};

function getURLSearchParams(url, name) {
  if (!name) {
    return window.location.search;
  }
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * 加载 URL Script
 * @param url
 * @return {Promise<function|void>}
 */
function loadScript(url) {
  const key = getURLSearchParams(url, 'key');
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;

    script.onload = () => {
      resolve(key ? window[key] : void 0);
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${url}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * 加载 CDN URL
 * @param cdnUrls
 * @return {Promise<function|void>}
 */
function loadCDNs(cdnUrls) {
  return new Promise((resolve, reject) => {
    const tryLoadCDN = async index => {
      if (index >= cdnUrls.length) {
        // 所有 CDN 地址都尝试加载失败
        reject(new Error('Failed to load any CDN.'));
        return;
      }

      const currentURL = cdnUrls[index];

      try {
        // 尝试加载当前 CDN 地址
        const result = await loadScript(currentURL);
        resolve(result);
        console.log(`Successfully loaded CDN: ${currentURL}`);
      } catch (error) {
        console.error(`Failed loaded CDN: ${currentURL}`);
        // 尝试加载下一个 CDN 地址
        await tryLoadCDN(index + 1);
      }
    };

    // 开始尝试加载第一个 CDN 地址
    tryLoadCDN(0).then();
  });
}
