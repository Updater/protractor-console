# Changelog

## 3.0.0
##### Breaking
Remove Babel transpilation. Node 6.4.0 or greater is now required.

##### Fixes
Handle `browser.manage.logs()` failing. GeckoDriver currently doesn't support it and blows up with a stack trace.

## 2.0.1
##### Fixes
* Don't print header when there are 0 results after filtering.

## 2.0.0
##### Breaking
* Require `protractor` `> 2.2.0` as a `peerDependency`.

##### Fixes
* Make plugin compatible with the new plugin system introduced in `protractor` `2.2.0`.

## 1.0.1
##### Fixes
* Add `protractor` as a `< 2.1.0` `peerDependency` to indicate that `1.x` isn't compatible with `protractor` `2.2.0` and above.
