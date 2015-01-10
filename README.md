pt
============
##Description
###What is pt?
Pt is a firefox extension that helps you track price change. You can also track any text information with it
###How does it work?
* Select price you would like to track. Selected element is highlighted

![ScreenShot](https://raw.githubusercontent.com/e-shulitsky/pt/master/screenshoots/select_item.png)

* Give item a title or use default one

![ScreenShot](https://raw.githubusercontent.com/e-shulitsky/pt/master/screenshoots/add_new.png)

* Track price change with color indicators

![ScreenShot](https://raw.githubusercontent.com/e-shulitsky/pt/master/screenshoots/item_status.png)

##Run extension to preserve settings with command:
```
cfx run --profiledir=./.cfx_profile/
```

##Name guide
- Signals name:
```
who_emmits-name
```

##Compile templates on change
Set environmental variables `NUNJUCKS_REPO`(path to the cloned nunjucks git repository) and `TEMPLATES_DIR`(path to templates folder) or pass them as command arguments. Then run scripts which will compile templates on change:
```
./watch_nunjucks.py
```
