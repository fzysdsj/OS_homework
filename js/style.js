		/***********
            方丈遗少杜三贱，丁酉四月廿一。
            操作系统进程调度模拟算法和存储管理动态分区分配及回收算法js实现。
            进程调度算法数据同步到了界面上，存储管理动态分区分配及回收算法只是在控制台中测试，并未同步到界面上。
            可在浏览器中按F12在控制台查看。（因为逻辑已经写完了，同步到页面也就是动态生成个div加些样式，innerHTML的事
            鉴于方丈为这算法精疲力尽的现状，就不做界面了，也不做详细的数据校验了。JS写这些，是真的恶心啊。怕除了我也
            没其他人这么给自己找事做了......）
            个人博客： fzysdsj.github.io
            QQ:505589500
            **************/
        //jq实现基本逻辑
		//入口函数
		$(function() {
            //实验一
		    //初始化数组
		    var data = [];
		    var dataFished = [];
		    var dataNotChanged = [];
		    //封装主菜单选择模块,降低用户使用难度，提升用户体验。
		    function Hideorshow(id1, id2, id3, id4) {
		        $(id1).click(function() {
		            $(id2).hide(1000);
		            $(id3).show(1000, function() {
		                $(id4).show(1000);
		            });
		        });
		    };
		    //封装淡入淡出函数
		    function slideToggle(id1, id2) {
		        $(id1).click(function() {
		            $(id2).show(1000);
		            $(id2).hide(5000);
		        });
		    };
		    //封装隐藏模块
		    function Hide(id1, id2) {
		        $(id1).click(function() {
		            $(id2).hide(1000);
		        });
		    };
		    //封装显示模块
		    function Show(id1, id2, action) {
		        $(id1).click(function() {
		            $(id2).show(1000);
		        });
		    };
		    //实验一 进程调度模拟算法
		    //伪造表单重置
		    $("#btn2").click(function() {
		        //文本框的值只能用val（），不能用text（）。
		        $('#name').val("");
		        $('#needtime').val("");
		        $('#number').val("");
		        $('#yanzheng').text("");
		        $('#yanzhengtime').text("");
		        $('#yanzhengnumber').text("");
		    });
		    //重置全部进程权限判定
		    $("#btn3").click(function() {
		        if (confirm("确定要重置全部进程？")) {
		            //点击是的时候刷新页面，暂时不能写。
		            $('#number')[0].parentNode.style.display = 'block';
		            $('#name').val("");
		            $('#needtime').val("");
		            $('#number').val("");
		            $('#yanzheng').text("");
		            $('#yanzhengnumber').text("");
		            $('#yanzhengtime').text("");
		            $("#yxsf").empty();
		            $("#lzsf").empty();
		            data = [];
		            dataFished = [];
		        }
		    });
		    //验证进程数是否符合要求
		    $('#number').blur(function() {
		        var number = $('#number').val();
		        //判断是否是正整数
		        if (isNaN(number) || number % 1 != 0 || number <= 0) {
		            //jq转dom对象并设置按钮为不可操作
		            $('#btn1')[0].disabled = true;
		            $('#yanzhengnumber').text("❌  进程数只能是整正数！");
		            $('#yanzhengnumber').css({
		                "color": "red",
		                "opacity": "0.9"
		            });
		        }
		        //判断是否为空
		        else if (number == "") {
		            //jq转dom对象并设置按钮为不可操作
		            $('#btn1')[0].disabled = true;
		            $('#yanzhengnumber').text("❌  进程数不能为空！");
		            $('#yanzhengnumber').css({
		                "color": "red",
		                "opacity": "0.9"
		            });
		        } else {
		            //jq转dom对象并设置按钮为不可操作
		            $('#btn1')[0].disabled = true;
		            $('#yanzhengnumber').text("✅ 输入正确！");
		            $('#yanzhengnumber').css({
		                "color": "green",
		                "opacity": "0.8"
		            });
		            var timeOpacity = $('#yanzhengtime').css("opacity");
		            var nameOpacity = $('#yanzheng').css("opacity");
		            var numberOpacity = $('#yanzhengnumber').css("opacity");
		            if (timeOpacity == 0.8 && nameOpacity == 0.8 && numberOpacity == 0.8) { //jq转dom对象并设置按钮为可操作
		                $('#btn1')[0].disabled = false;
		            };
		        };
		    });
		    //验证进程名是否符合要求
		    $('#name').blur(function() {
		        var name = $('#name').val();
		        if (name == "") {
		            //jq转dom对象并设置按钮为不可操作
		            $('#btn1')[0].disabled = true;
		            $('#yanzheng').text("❌  进程名不能为空！");
		            $('#yanzheng').css({
		                "color": "red",
		                "opacity": "0.9"
		            });
		        } else {
		            //jq转dom对象并设置按钮为不可操作
		            $('#btn1')[0].disabled = true;
		            $('#yanzheng').text("✅ 输入正确！");
		            $('#yanzheng').css({
		                "color": "green",
		                "opacity": "0.8"
		            });;
		        };
		        var timeOpacity = $('#yanzhengtime').css("opacity");
		        var nameOpacity = $('#yanzheng').css("opacity");
		        var numberOpacity = $('#yanzhengnumber').css("opacity");
		        //验证数据是否正确（透明度如果都为0.8则为正确，录入按钮变为可操作，否则不可操作。）
		        if (timeOpacity == 0.8 && nameOpacity == 0.8 && numberOpacity == 0.8) { //jq转dom对象并设置按钮为可操作
		            $('#btn1')[0].disabled = false;
		        }
		    });
		    // 验证进程需要时间是否符合要求
		    $('#needtime').blur(function() {
		        var time = $('#needtime').val();
		        //判断是否是正整数
		        if (isNaN(time) || time % 1 != 0 || time <= 0 || time > 50) {
		            //jq转dom对象并设置按钮为不可操作
		            $('#btn1')[0].disabled = true;
		            $('#yanzhengtime').text("❌  需要时间片数只能是不大于50的整正数！");
		            $('#yanzhengtime').css({
		                "color": "red",
		                "opacity": "0.9"
		            });
		        }
		        //判断是否为空
		        else if (time == "") {
		            //jq转dom对象并设置按钮为不可操作
		            $('#btn1')[0].disabled = true;
		            $('#yanzhengtime').text("❌  时间片数不能为空！");
		            $('#yanzhengtime').css({
		                "color": "red",
		                "opacity": "0.9"
		            });
		        } else {
		            //jq转dom对象并设置按钮为不可操作
		            $('#btn1')[0].disabled = true;
		            $('#yanzhengtime').text("✅ 输入正确！");
		            $('#yanzhengtime').css({
		                "color": "green",
		                "opacity": "0.8"
		            });
		        };
		        var timeOpacity = $('#yanzhengtime').css("opacity");
		        var nameOpacity = $('#yanzheng').css("opacity");
		        var numberOpacity = $('#yanzhengnumber').css("opacity");
		        //验证数据是否正确（透明度如果都为0.8则为正确，录入按钮变为可操作，否则不可操作。我尼玛真是天才！）
		        if (timeOpacity == 0.8 && nameOpacity == 0.8 && numberOpacity == 0.8) { //jq转dom对象并设置按钮为可操作
		            $('#btn1')[0].disabled = false;
		        }
		    });
		    //调用函数
		    Hideorshow("li:eq(1)", ".li1", ".li2", "#two");
		    Hideorshow("li:eq(0)", ".li2", ".li1", "#inf");
		    //录入各进程并排序
		    $("#btn1").click(function() {
		        $('#btn1')[0].disabled = true;
		        var yxnumber = $('#number').val();
		        var yxneedtime = $('#needtime').val();
		        var priority = 50 - yxneedtime;
		        var state = 'R';
		        var yxname = $('#name').val();
		        var cputime = 0;
		        $('#name').val("");
		        $('#needtime').val("");
		        $('#yanzhengtime').css("opacity", "0.9");
		        $('#yanzheng').css("opacity", "0.9");
		        $('#yanzheng').text("");
		        $('#yanzhengtime').text("");
		        $('#yanzhengnumber').text("");
		        data.push({
		            "name": yxname,
		            "yxneedtime": yxneedtime,
		            "cputime": cputime,
		            "priority": priority,
		            "state": state

		        });
		        console.log("datalength:" + data.length);
		        // //降序排序
		        //   data.sort(function(a,b){
		        //       return b.priority-a.priority;
		        //     });
		        //  for(var i=0;i<data.length;i++){
		        //   if(i ==0){
		        //       // console.log("i'm borther");
		        //      data[i].state ="R";
		        //   }
		        //   else if(data[i].yxneedtime ==0){
		        //       // console.log("woshi erge");
		        //       data[i].state = "F";
		        //   }
		        //   else {
		        //       // console.log("woshi sandi");
		        //       data[i].state = "W";
		        //   }
		        // console.log(data[i].name+"的优先数长度:"+data[i].priority);
		        // console.log("第"+(i+1)+"个进程：名称："+data[i].name+",需要时间："+data[i].yxneedtime+",占用时间："+data[i].cputime+",优先数："+data[i].priority+",状态："+data[i].state);
		        // }
		        if (data.length < yxnumber) {
		            // console.log(data.length);
		            $('#number')[0].parentNode.style.display = 'none';
		            $('#titleinf').text("请填写第" + (data.length + 1) + "个进程信息：");
		            alert("录入成功，请继续输入第" + (data.length + 1) + "个进程信息！");
		        }
		        if (data.length == yxnumber) {
		            $('#number')[0].parentNode.style.display = 'none';
		            $('#titleinf').text("若要重新录入进程请点击红色按钮，若要追加请直接在下方追加：");
		            $('#h5').show(1000);
		            $('#h5').hide(3000);
		            $("#one").show(1000);
		        };
		    });
		    //优先数算法逻辑实现
		    $("#youxian").click(function() {
		        if (confirm("执行后无法再选择其它算法，且追加无效，是否执行？")) {
		            clearInterval(timer);
		            $("#lzxs").hide(1000);
		            $("#yxxs").show(1000);
		            var timer = null;
		            for (var i = 0; i < data.length; i++) {
		                console.log("第" + (i + 1) + "个进程：" + data[i].name + "," + data[i].yxneedtime);
		            }
		            timer = setInterval(function() {
		                //降序排序
		                data.sort(function(a, b) {
		                    return b.priority - a.priority;
		                });
		                for (var i = 0; i < data.length; i++) {
		                    if (i == 0) {
		                        console.log("i'm borther");
		                        data[i].state = "R";
		                        $("#yxsf").append('<span>🏃 名称：' + data[i].name +
		                            ",需要时间：" + data[i].yxneedtime +
		                            ",占用时间：" + data[i].cputime +
		                            ",优先数：" + data[i].priority +
		                            ",状态：" + data[i].state +
		                            '</span><br/>');
		                        if (data[0].yxneedtime <= 0) {
		                            data[0].state = 'F';
		                            dataFished.push(data[0]);
		                            for (var i = 0; i < dataFished.length; i++) {
		                                $("#yxsf").append('<span>🚥 第' + (i + 1) +
		                                    "个完成进程名称：" + dataFished[i].name +
		                                    ",需要时间：" + dataFished[i].yxneedtime +
		                                    ",占用时间：" + dataFished[i].cputime +
		                                    ",优先数：" + dataFished[i].priority +
		                                    ",状态：" + dataFished[i].state +
		                                    '</span><br/>');
		                            }
		                            data.shift();
		                        } else {
		                            data[0].yxneedtime--;
		                            data[0].priority--;
		                            data[0].cputime++;
		                        }
		                    } else {
		                        console.log("woshi sandi");
		                        data[i].state = "W";
		                        $("#yxsf").append('<span>🐂  第' + i +
		                            "个就绪进程名称：" + data[i].name +
		                            ",需要时间：" + data[i].yxneedtime +
		                            ",占用时间：" + data[i].cputime +
		                            ",优先数：" + data[i].priority +
		                            ",状态：" + data[i].state +
		                            '</span><br/>');
		                    }
		                }
		            }, 0);
		        }
		    });
		    //轮转算法逻辑实现
		    $("#lunzhuan").click(function() {
		        if (confirm("执行后无法再选择其它算法，且追加无效，是否执行？")) {
		            clearInterval(timer);
		            $("#yxxs").hide(1000);
		            $("#lzxs").show(1000);
		            // $('#yxsf').empty();
		            var timer = null;
		            for (var i = 0; i < data.length; i++) {
		                console.log("第" + (i + 1) + 
                            "个进程：" + data[i].name + 
                            "," + data[i].yxneedtime
                            );
		            }
		            timer = setInterval(function() {
		                //降序排序
		                // data.sort(function(a,b){
		                //         return b.priority-a.priority;
		                //       });
		                for (var i = 0; i < data.length; i++) {
		                    if (i == 0) {
		                        console.log("i'm borther");
		                        data[i].state = "R";
		                        $("#lzxs").append('<span>🏃 名称：' + data[i].name +
		                            ",需要时间：" + data[i].yxneedtime +
		                            ",占用时间：" + data[i].cputime +
		                            ",状态：" + data[i].state +
		                            '</span><br/>');
		                        if (data[0].yxneedtime <= 0) {
		                            data[0].state = 'F';
		                            dataFished.push(data[0]);
		                            for (var i = 0; i < dataFished.length; i++) {
		                                $("#lzxs").append('<span>🚥 第' + (i + 1) +
		                                    "个完成进程名称：" + dataFished[i].name +
		                                    ",需要时间：" + dataFished[i].yxneedtime +
		                                    ",占用时间：" + dataFished[i].cputime +
		                                    ",状态：" + dataFished[i].state +
		                                    '</span><br/>');
		                            }
		                            data.shift();
		                        } else {
		                            data[0].yxneedtime >= 2 ? data[0].yxneedtime -= 2 : data[0].yxneedtime = 0;
		                            data[0].cputime += 2;
		                            if (data.length > 1) {
		                                console.log("datatime:" + data[0].yxneedtime);
		                                data[0].state = "W";
		                                data.push(data[0]);
		                                $("#lzxs").append('<span>🐂  第' + (i + 1) +
		                                    "个就绪进程名称：" + data[i + 1].name +
		                                    ",需要时间：" + data[i + 1].yxneedtime +
		                                    ",占用时间：" + data[i + 1].cputime +
		                                    ",状态：" + data[i + 1].state +
		                                    '</span><br/>');
		                                data.shift();
		                            }
		                        }
		                    } else {
		                        if (i < data.length - 1) {
		                            console.log("woshi sandi");
		                            data[i].state = "W";
		                            $("#lzxs").append('<span>🐂  第' + (i + 1) +
		                                "个就绪进程名称：" + data[i].name +
		                                ",需要时间：" + data[i].yxneedtime +
		                                ",占用时间：" + data[i].cputime +
		                                ",状态：" + data[i].state +
		                                '</span><br/>');
		                        }
		                    }
		                }
		            }, 0);
		        }
		    });
		    //实验二
            //页面显示隐藏逻辑实现
		    $("#firstFit").click(function() {
		        $("#zjsy").hide(1000);
		        $("#scsy").show(1000);
		        $("#scfenpei").click(function() {
		            $("#scsyhs").hide();
		            $("#scsyfp").show();
		        });
		        $("#schuishou").click(function() {
		            $("#scsyfp").hide();
		            $("#scsyhs").show();
		        });
		    });
		    $("#bestFit").click(function() {
		        $("#scsy").hide(1000);
		        $("#zjsy").show(1000);
		        $("#zjfenpei").click(function() {
		            $("#zjsyhs").hide();
		            $("#zjsyfp").show();
		            var str = "";
		        });
		        $("#zjhuishou").click(function() {
		            $("#zjsyfp").hide();
		            $("#zjsyhs").show();
		        });
		    });
		    //定义初值
            //内存空间值，常量，默认为32767
		    const size = 32767;
            //内存空闲值，默认为32767
		    var sizeUse = size;
            //首址，默认为0
		    var adr = 0;
            //初始化空间数组
		    var arr = [];
            //获取工作区数组
		    var arrUse = [];
            //存放工作区数组
		    var arrUser = [];
            //存放空闲区数组
		    var arrNotUse = [{
		        Begin: 0,
		        End: size,
		        Length: size
		    }];
            //空闲区初始值为空间大小
		    var arrNotUseLength = 1;
		    var str;
		    var flag;
		    var arrFlag;
		    var n = 0;
		    var string = size;
		    var len;
		    var begin;
            //判断是否有回收回来的空闲区
		    var byFlag = true;
            //判断要回收工作区是否匹配。
		    var acceptFlag = false;
            //初始化空间，数组模拟地址。
		    for (var i = 0; i < size; i++) {
		        arr[i] = i;
		    }
            //初始化函数
		    var huishou = function() {};
            //函数原型，定义相关方法。封装在函数内部，外边调用使用。遵循“高内聚，低耦合”。
		    huishou.prototype = {
                //检查要分配或回收空间是否合法。
		        check: function(msg, leng) {
		            console.log(leng);
		            (msg > 0 && msg <= leng) ? (flag = true) : (flag = false);
		            return flag;
		        },
		        //实现首次适应算法的分配
		        assignment1: function(msg) {
		            arrFlag = false;
		            console.log("未执行此次分配时空闲区和工作区状况：" + parseInt(arrNotUse.length) + "," + arrUser.length);
		            for (var i = 0; i < arrUser.length; i++) {
		                console.log("工作区编号：" + i +
		                    "首址：" + arrUser[i].Begin +
		                    "终址：" + arrUser[i].End +
		                    "大小:" + arrUser[i].Length
		                );
		            }
		            for (var i = 0; i < arrNotUse.length; i++) {
		                console.log("空闲区编号：" + i +
		                    "首址：" + arrNotUse[i].Begin +
		                    "终址：" + arrNotUse[i].End +
		                    "大小:" + arrNotUse[i].Length
		                );
		            }
		            console.log("执行此次分配后：");
                    byFlag = true;
                    //判断是否有回收回来的空闲区
		            for (var i = 0; i < (parseInt(arrNotUse.length) - 1); i++) {
		                if (msg <= arrNotUse[i].Length) {
		                    len = msg;
		                    begin = arrNotUse[i].Begin;
		                    str = {
		                        Begin: begin,
		                        End: parseInt(len) + parseInt(begin),
		                        Length: msg
		                    }
		                    arrFlag = true;
                            byFlag = false;
		                    var b = parseInt(arrNotUse[i].Begin) + parseInt(msg);
		                    console.log("编号" + i + "的空闲块:" + JSON.stringify(arrNotUse[i]));
		                    if (b == arrNotUse[i].End) {
		                        console.log("我里面满了！！");
		                        arrUser.push(arrNotUse[i]);
		                        arrNotUse.splice(i, 1);
		                    }
		                    string = string - msg;
		                    // console.log("该空闲区："+begin);
		                    // console.log("该字符串："+JSON.stringify(str));
		                    break;
		                }
		            }
		            if (arrFlag) {
		                for (var i = 0; i < arrUser.length; i++) {
		                    console.log("工作区编号：" + i +
		                        "首址：" + arrUser[i].Begin +
		                        "终址：" + arrUser[i].End +
		                        "大小:" + arrUser[i].Length
		                    );
		                }
                         console.log("byFlag:"+byFlag);
		                console.log("┏┳┳┳┳┳┳华丽丽的分割线┳┳┳┓");
		                for (var i = 0; i < arrNotUse.length; i++) {
		                    console.log("空闲区编号：" + i +
		                        "首址：" + arrNotUse[i].Begin +
		                        "终址：" + arrNotUse[i].End +
		                        "大小:" + arrNotUse[i].Length
		                    );
		                }
		            }
		            if (arrNotUse[0].Length < msg) {
		                byFlag = false;
		            }
                    //如果没有回收回来的空闲区，就从大块空闲区中顺序分配。
		            if (byFlag) {
		                if (!arrFlag) {
		                    var len = parseInt(msg) + parseInt(adr);
		                    //获取空闲区首地址
		                    var begin = adr;
		                    //获取工作区
		                    arrUse += arr.slice(adr, len);
		                    adr = len;
		                    sizeUse -= (len - begin);
		                    str = {
		                        Begin: begin,
		                        End: len,
		                        Length: (len - begin)
		                    }
		                }
		                //将新的工作区推送入数组
		                arrUser.push(str);
		                for (var i = 0; i < arrUser.length; i++) {
		                    console.log("工作分区编号：" + i +
		                        "首址:" + arrUser[i].Begin +
		                        "终址：" + arrUser[i].End +
		                        "大小：" + arrUser[i].Length +
		                        "\n\n")
		                }
		                for (var i = 0; i < arrNotUse.length; i++) {
                            //判断空闲区长度是否为0
		                    if (arrNotUse[0].End == size) {
		                        arrNotUse.splice(i, 1);
		                    }
		                }
		                arrNotUseStr = {
		                        Begin: arrUser[arrUser.length - 1].End,
		                        End: size,
		                        Length: (size - arrUser[arrUser.length - 1].End)
		                    }
		                    //将空闲区推送入数组,这不对。
		                arrNotUse.push(arrNotUseStr);
		                //判断空闲区数量是否大于arrNotUseLength
		                // if( arrNotUse.length > arrNotUseLength ) {
		                //     arrNotUse.splice( arrNotUseLength-1,1 );
		                //     if( arrNotUseLength > 1) {
		                //         n = -1; 
		                //     }
		                // }
		                // console.log("空闲区长度:"+arrNotUse[0].Length);
		                // for(var i = 0;i < arrNotUse.length-1;i++){
		                //     if(arrNotUse.length>=2){
		                //          if( arrNotUse[i].Begin > arrNotUse[i+1].Begin){
		                //         var j = 0;
		                //         j = arrNotUse[i+1];
		                //         arrNotUse[i+1] = arrNotUse[i];
		                //         arrNotUse[i] = j;
		                //     }
		                //     }
		                // }
		                // for ( var i = 0;i < arrNotUse.length;i++ ){
		                //     // console.log("第"+i+"个空闲区:"+arrNotUse[i].Begin);
		                //     // console.log(arrNotUse[i].Begin);
		                //     arrNotUseStr = arrNotUseStr +
		                //     "空闲分区编号：" + ( n + i ) +
		                //     "首址:" + arrNotUse[i].Begin +
		                //     "终址：" + arrNotUse[i].End +
		                //     "大小：" + arrNotUse[i].Length +
		                //     "\n\n";
		                //     // console.log(arrNotUse[i].Begin+"\n");
		                // }

		                for (var i = 0; i < arrNotUse.length; i++) {
		                    console.log("空闲分区编号：" + i +
		                        "首址:" + arrNotUse[i].Begin +
		                        "终址：" + arrNotUse[i].End +
		                        "大小：" + arrNotUse[i].Length +
		                        "\n\n")
		                }
		                string = 0;
		                for (var i = 0; i < arrNotUse.length; i++) {
		                    string += arrNotUse[i].Length;
		                    console.log("第" + (i + 1) + "个空闲区长度：" + arrNotUse[i].Length);
		                }
		                console.log("空闲区总长度：" + string);
		            }
		        },
		        //实现最佳适应算法的分配
		        assignment2: function(msg) {
		             arrFlag = false;
                    console.log("未执行此次分配时空闲区和工作区状况：" + parseInt(arrNotUse.length) + "," + arrUser.length);
                    for (var i = 0; i < arrUser.length; i++) {
                        console.log("工作区编号：" + i +
                            "首址：" + arrUser[i].Begin +
                            "终址：" + arrUser[i].End +
                            "大小:" + arrUser[i].Length
                        );
                    }
                    for (var i = 0; i < arrNotUse.length; i++) {
                        console.log("空闲区编号：" + i +
                            "首址：" + arrNotUse[i].Begin +
                            "终址：" + arrNotUse[i].End +
                            "大小:" + arrNotUse[i].Length
                        );
                    }
                    console.log("执行此次分配后：");
                    byFlag = true;
                    //判断是否有回收回来的空闲区
                    for (var i = 0; i < (parseInt(arrNotUse.length) - 1); i++) {
                        if (msg <= arrNotUse[i].Length) {
                            len = msg;
                            begin = arrNotUse[i].Begin;
                            str = {
                                Begin: begin,
                                End: parseInt(len) + parseInt(begin),
                                Length: msg
                            }
                            arrFlag = true;
                            byFlag = false;
                            var b = parseInt(arrNotUse[i].Begin) + parseInt(msg);
                            console.log("编号" + i + "的空闲块:" + JSON.stringify(arrNotUse[i]));
                            if (b == arrNotUse[i].End) {
                                console.log("我里面满了！！");
                                arrUser.push(arrNotUse[i]);
                                arrNotUse.splice(i, 1);
                            }
                            string = string - msg;
                            // console.log("该空闲区："+begin);
                            // console.log("该字符串："+JSON.stringify(str));
                            break;
                        }
                    }
                    if (arrFlag) {
                        for (var i = 0; i < arrUser.length; i++) {
                            console.log("工作区编号：" + i +
                                "首址：" + arrUser[i].Begin +
                                "终址：" + arrUser[i].End +
                                "大小:" + arrUser[i].Length
                            );
                        }
                         console.log("byFlag:"+byFlag);
                        console.log("┏┳┳┳┳┳┳华丽丽的分割线┳┳┳┓");
                        for (var i = 0; i < arrNotUse.length; i++) {
                            console.log("空闲区编号：" + i +
                                "首址：" + arrNotUse[i].Begin +
                                "终址：" + arrNotUse[i].End +
                                "大小:" + arrNotUse[i].Length
                            );
                        }
                    }
                    if (arrNotUse[0].Length < msg) {
                        byFlag = false;
                    }
                    //如果没有回收回来的空闲区，就从大块空闲区中顺序分配。
                    if (byFlag) {
                        if (!arrFlag) {
                            var len = parseInt(msg) + parseInt(adr);
                            //获取空闲区首地址
                            var begin = adr;
                            //获取工作区
                            arrUse += arr.slice(adr, len);
                            adr = len;
                            sizeUse -= (len - begin);
                            str = {
                                Begin: begin,
                                End: len,
                                Length: (len - begin)
                            }
                        }
                        //将新的工作区推送入数组
                        arrUser.push(str);
                        // for(var i = 0;i < arrUser.length;i++  ) {     
                        //     arrStr = arrStr +
                        //     "工作分区编号：" + i +
                        //     "起址：" + arrUser[i].Begin +
                        //     "终址：" + arrUser[i].End +
                        //     "大小：" + arrUser[i].Length +
                        //     "\n\n";
                        // } 
                        for (var i = 0; i < arrUser.length; i++) {
                            console.log("工作分区编号：" + i +
                                "首址:" + arrUser[i].Begin +
                                "终址：" + arrUser[i].End +
                                "大小：" + arrUser[i].Length +
                                "\n\n")
                        }
                        for (var i = 0; i < arrNotUse.length; i++) {
                            //判断空闲区长度是否为0
                            if (arrNotUse[0].End == size) {
                                arrNotUse.splice(i, 1);
                            }
                        }
                        arrNotUseStr = {
                                Begin: arrUser[arrUser.length - 1].End,
                                End: size,
                                Length: (size - arrUser[arrUser.length - 1].End)
                            }
                            //将空闲区推送入数组,这不对。
                        arrNotUse.push(arrNotUseStr);
                        for (var i = 0; i < arrNotUse.length; i++) {
                            console.log("空闲分区编号：" + i +
                                "首址:" + arrNotUse[i].Begin +
                                "终址：" + arrNotUse[i].End +
                                "大小：" + arrNotUse[i].Length +
                                "\n\n")
                        }
                        string = 0;
                        for (var i = 0; i < arrNotUse.length; i++) {
                            string += arrNotUse[i].Length;
                            console.log("第" + (i + 1) + "个空闲区长度：" + arrNotUse[i].Length);
                        }
                        console.log("空闲区总长度：" + string);
                    }
		        },
		        //实现首次适应算法的回收
		        acceptment1: function() {
		            var firstId = $("#intHs").val();
		            var lengthHs = $("#lengthHs").val();
		            console.log(arrUser.length);
		            for (var i = 0; i < arrUser.length; i++) {
		                if (firstId == arrUser[i].Begin) {
		                    alert("我匹配上了");
		                    arrNotUse.push(arrUser[i]);
		                    string = parseInt(string) + parseInt(arrUser[i].Length);
		                    arrUser.splice(i, 1);
		                    arrNotUseLength++;
		                    acceptFlag = true;
		                    console.log("string 长度：" + string);
		                }
		            }
		            if (!acceptFlag) {
		                alert("不存在此工作块！！");
		            }
		            console.log("回收分区操作后：");
		            for (var i = 0; i < arrUser.length; i++) {
		                console.log("工作分区编号：" + i +
		                    "首址:" + arrUser[i].Begin +
		                    "终址：" + arrUser[i].End +
		                    "大小：" + arrUser[i].Length +
		                    "\n\n")

		            }
                    //按首址升序
		           arrNotUse.sort(function(a, b) {
                            return a.Begin - b.Begin;
                        });
		            for (var i = 0; i < arrNotUse.length; i++) {
		                console.log("空闲分区编号：" + i +
		                    "首址:" + arrNotUse[i].Begin +
		                    "终址：" + arrNotUse[i].End +
		                    "大小：" + arrNotUse[i].Length +
		                    "\n\n")
		            }
		        },
		        //实现最佳适应算法的回收
		        acceptment2: function() {
                    var firstIdFp = $("#zj_intHS").val();
                    var lengthHsFp = $("#zj_lengthHs").val();
                    console.log(arrUser.length);
                    for (var i = 0; i < arrUser.length; i++) {
                        if (firstIdFp == arrUser[i].Begin) {
                            alert("我匹配上了");
                            arrNotUse.push(arrUser[i]);
                            string = parseInt(string) + parseInt(arrUser[i].Length);
                            arrUser.splice(i, 1);
                            arrNotUseLength++;
                            acceptFlag = true;
                            console.log("string 长度：" + string);
                        }
                    }
                    if (!acceptFlag) {
                        alert("不存在此工作块！！");
                    }
                    console.log("回收分区操作后：");
                    for (var i = 0; i < arrUser.length; i++) {
                        console.log("工作分区编号：" + i +
                            "首址:" + arrUser[i].Begin +
                            "终址：" + arrUser[i].End +
                            "大小：" + arrUser[i].Length +
                            "\n\n")
                    }
                    // for (var i = 0; i < arrNotUse.length - 1; i++) {
                    //     if (arrNotUse.length >= 2) {
                    //         if (arrNotUse[i].Length > arrNotUse[i + 1].Length) {
                    //             var j = 0;
                    //             j = arrNotUse[i + 1];
                    //             arrNotUse[i + 1] = arrNotUse[i];
                    //             arrNotUse[i] = j;
                    //         }
                    //     }
                    // }
                    //按长度升序
                    arrNotUse.sort(function(a, b) {
                            return a.Length - b.Length;
                        });
                    for (var i = 0; i < arrNotUse.length; i++) {
                        console.log("空闲分区编号：" + i +
                            "首址:" + arrNotUse[i].Begin +
                            "终址：" + arrNotUse[i].End +
                            "大小：" + arrNotUse[i].Length +
                            "\n\n")
                    }
		        }
		    }
		    var huishou = new huishou();
		    $("#result").click(function() {
		        free = $("#int").val();
                var numberBegin = $("intHs").val();
                var numberLength = $("lengthHs").val();
                //清空文本框
                $("#int").val('');
                $("intHs").val("");
                $("lengthHs").val("");
		        var s = huishou.check(free, string);
		        if (s) {
		            huishou.assignment1(free);
		        } else {
		            alert("未输入或空闲区不足，请核实后再输！");
		        }
		    });
		    $("#zj_result").click(function() {
		        free = $("#zj_intFp").val();
                var numberBeginZj = $("zj_intHS").val();
                var numberLengthZj = $("zj_lengthHs").val();
                $("#zj_intFp").val("");
                $("zj_intHS").val("");
                $("zj_lengthHs").val("");
		        var s = huishou.check(free, string);
		        if (s) {
		            huishou.assignment2(free);
		        } else {
		            alert("未输入或空闲区不足，请核实后再输！");
		        }
		    });
		    $("#resultHs").click(function() {
		        huishou.acceptment1();
		    }); 
            $("#zj_resultHs").click(function() {
		        huishou.acceptment2();
		    })
		});