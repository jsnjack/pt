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
