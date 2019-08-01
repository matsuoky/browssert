# browssert
Simple puppeteer(headless chrome) test assertion( and screenshots).

画面確認系テストの自動化ツール  
画面をアサートテストしてスクリーンショットを取得するやつ  
json形式で最初にアクセスする画面URL、ブラウザ上で必要なアクション、テストする箇所と期待値を書いておく  
テストしたい箇所をセレクタで"target"に指定し、期待する値を"expected"にセットする  
1つのURL(画面)に対し複数の箇所(セレクタ)、期待値を指定できる  
page要素とnext要素を入れ子にすることでページ遷移のシナリオを表現する  
ログインIDやパスワードを入力してログイン画面をパスしたりもできる  

# Installation
```
npm i puppeteer
```
##### [puppeteer docs](https://github.com/GoogleChrome/puppeteer)


# Usage
```
node browssert.js items.json
```

ex) items.json
```
{"items":[
	{"url":"https://github.com", "target":[{"selector":".col-md-7 > h1", "expected":"Built for developers"}]},
	{"url":"https://github.com", 
		"page":{
			"target":[
				{"selector":".col-md-7 > h1", "expected":"Built for developers"},
				{"selector":"nav > ul > li:nth-child(2) a", "expected":"Enterprise"}
			],
			"next":{
				"selector":"header > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > a:nth-child(2)",
				"type":"click",
				"page":{
					"next":{
						"selector":"input[name='commit']",
						"type":"click",
						"input":[
							{
								"selector":"#login_field",
								"type":"text",
								"val":"xxx@gmail.com"
							},
							{
								"selector":"#password",
								"type":"text",
								"val":"xxx"
							}
						],
						"page":{
							"target":[
								{"selector":"header > div:nth-child(3) > nav > a:nth-child(2)", "expected":"\n    Pull requests\n"},
								{"selector":"header > div:nth-child(3) > nav > a:nth-child(3)", "expected":"\n    Issues\n"}
							]
						}
					}
				}
			}
		}
	}
]}
```

# Output image
```
$ node browssert.js items.json
[item.0] 
page title: The world’s leading software development platform · GitHub
OK:result=Built for developers:expected=Built for developers
[item.1] 
page title: The world’s leading software development platform · GitHub
OK:result=Built for developers:expected=Built for developers
page title: The world’s leading software development platform · GitHub
OK:result=Enterprise:expected=Enterprise
page title: GitHub
OK:result=
    Pull requests
:expected=
    Pull requests

page title: GitHub
OK:result=
    Issues
:expected=
    Issues
```
