/**
 * User-Agent parsing, deliberately small. It recognises what actually shows up
 * in a portfolio's traffic and returns honest placeholders for everything else;
 * a full UA database would be a dependency and a lie about precision.
 */

export type Device = 'Desktop' | 'Mobile' | 'Tablet'

export type ClientInfo = {
  browser: string
  os: string
  device: Device
}

/** Order is load bearing: Edge, Opera and Samsung all also claim Chrome, and
 *  Chrome also claims Safari. First match wins, so the impostors come first. */
const BROWSERS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bEdg(?:e|A|iOS)?\/(\d+)/, 'Edge'],
  [/\bOPR\/(\d+)/, 'Opera'],
  [/\bSamsungBrowser\/(\d+)/, 'Samsung Internet'],
  [/\bFirefox\/(\d+)/, 'Firefox'],
  [/\bChrome\/(\d+)/, 'Chrome'],
  [/\bVersion\/(\d+)[\d.]*\s+(?:Mobile\/\S+\s+)?Safari\//, 'Safari'],
]

const OSES: ReadonlyArray<readonly [RegExp, (m: RegExpMatchArray) => string]> = [
  [/\bWindows NT 10\.0/, () => 'Windows 10/11'],
  [/\bWindows NT ([\d.]+)/, (m) => `Windows NT ${m[1]}`],
  [/\b(?:iPhone|iPad); CPU (?:iPhone )?OS ([\d_]+)/, (m) => `iOS ${m[1]!.replace(/_/g, '.')}`],
  [/\bMac OS X ([\d_]+)/, (m) => `macOS ${m[1]!.replace(/_/g, '.')}`],
  [/\bMacintosh\b/, () => 'macOS'],
  [/\bAndroid ([\d.]+)/, (m) => `Android ${m[1]}`],
  [/\bCrOS\b/, () => 'ChromeOS'],
  [/\bLinux\b/, () => 'Linux'],
]

function device(ua: string): Device {
  if (/\biPad\b/.test(ua)) return 'Tablet'
  if (/\bAndroid\b/.test(ua) && !/\bMobile\b/.test(ua)) return 'Tablet'
  if (/\b(?:Mobile|iPhone|iPod|Windows Phone)\b/.test(ua)) return 'Mobile'
  return 'Desktop'
}

export function parseUserAgent(ua: string): ClientInfo {
  if (!ua.trim()) return { browser: 'Unknown', os: 'Unknown', device: 'Desktop' }

  let browser = 'Unknown'
  for (const [pattern, name] of BROWSERS) {
    const m = ua.match(pattern)
    if (m) {
      browser = `${name} ${m[1]}`
      break
    }
  }

  let os = 'Unknown'
  for (const [pattern, render] of OSES) {
    const m = ua.match(pattern)
    if (m) {
      os = render(m)
      break
    }
  }

  return { browser, os, device: device(ua) }
}
