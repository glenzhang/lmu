# 命名空间 #
LMU - Lily Mobile UI

# 目录结构 #

    ├── lmu
        ├── js
          ├── core
            ├── lmu.js
            └── widget.js
          ├── extend
            ├── lmu.extend.js
            └── jquery.extend.js
          ├── plugins
          ├── vendors
          └── widget
        ├── css/
        ├── demo/
    ├── grunt.js
    ├── package.json

- js/core - lmu.js & widget.js, 其他的widget都需要依赖这2个
- js/extend - jQuery的扩展方法，LMU的帮助方法
- js/plugins - jQuery插件
- js/widget - UI组件
- js/vendors - 依赖的外部库，如jquery, iscroll
- 组件/jQuery插件需要用到的css
- demo - 所有的UI组件都**必须有demo页面**，作为使用者的参考
- grunt.js - grunt工作流
- package.json - node

# JS命名规范 #
1. 参数及内部变量名采用小驼峰法。除第一个单词之外，其他单词首字母大写。譬如变量myStudentCount第一个单词是全部小写，后面的单词首字母大写。

2. widget名采用大驼峰法。所有单词的首字母大写。常用于类名（需要使用new关键字的构造函数），命名空间。譬如 Dialog。

3. 内部函数使用"_"前缀。如下：

        LMU.UI.define("DemoWidget", { 
            init: function() { 
                 this._privateMethod();
            }, 
            _privateMethod: function() {
                return "private method";
            } 
        }); // 其中_privateMethod虽然外部也能访问，但对widget开发者来说此为局部函数，不对外使用。

    

# CSS命名规范 #
1. css文件名和组件名一致
2. 选择器规则为[前缀lmu]-[ill为imglazyload组件名首字母]-[class为自定义], 如 `lmu-ill-mask` 
3. 属性书写顺序
    - 位置属性(position, top, right, z-index, display, float等) 
    - 大小(width, height, padding, margin)
    - 文字系列(font, line-height, letter-spacing, color- text-align等)
    - 背景(background, border等)
    - 其他(animation, transition等)

#如何开发#

1. 定义组件，调用define方法，第一个参数为组件名，第二个参数为组件prototype对象。
         
        LMU.UI.define("WidgetName", { 
            init: function() {}
        });

2. jQuery插件

        $.fn.pluginName = function(options) {
            var settings = $.extend(true, {}, {
                    defOption: "default value"
                }, options);

            return this.each(function(){
                
            });
        };

3. 开发demo页面， 页面名字和组件名一样
    - demo页力求简单明了，让调用的同学在5s明白如何使用。