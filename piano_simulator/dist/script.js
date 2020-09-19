//soundpack定義一包一包的資料，給audio用，包含number:音符號碼跟url:音檔來源
var soundpack=[];
//要載入的音符號碼陣列
var soundpack_index=[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,8,8.5,9,9.5,10,11,11.5,12,12.5,13,13.5,14,15];
//推一包一包的資料進去，這邊會提供audio作渲染
for(var i=0;i<soundpack_index.length;i++){
  soundpack.push({
    number: soundpack_index[i],
    url: "https://awiclass.monoame.com/pianosound/set/"+soundpack_index[i]+".wav"
  });
}
//小星星的樂譜
//1;1;5;5;6;6;5;;4;4;3;3;2;2;1;;5;5;4;4;3;3;2;;5;5;4;4;3;3;2;;1;1;5;5;6;6;5;;4;4;3;3;2;2;1
//整個頁面的Vue物件
var vm = new Vue({
  el: "#app",
  data: {
    sounddata: soundpack,
    //這邊是音符，包括num: 播放的音跟time:在什麼時間點播放
    notes:[{num:3,time:105},{num:3,time:223},{num:4,time:331},{num:5,time:482},{num:5,time:565},{num:4,time:673},{num:3,time:782},{num:2,time:893},{num:1,time:1006},{num:1,time:1113},{num:2,time:1220},{num:3,time:1337},{num:3,time:1456},{num:2,time:1623},{num:2,time:1680},{num:3,time:1883},{num:3,time:1988},{num:4,time:2107},{num:5,time:2218},{num:5,time:2337},{num:4,time:2446},{num:3,time:2555},{num:2,time:2664},{num:1,time:2771},{num:1,time:2880},{num:2,time:2992},{num:3,time:3103},{num:2,time:3220},{num:1,time:3395},{num:1,time:3449}],
    //settimeout回傳的計時物件
    recorder: null,
    //現在播放時間
    playing_time: 0,
    //現在錄音時間
    record_time: 0,
    //下一個要播放的音符index
    next_note_id: 0,
    //現在正在播放的音符index
    now_note_id: 0,
    //現在按了甚麼鍵盤按鍵(ascii)
    now_press_key: -1,
    //播放用的settimeout計時物件
    player: null,
    //所有顯示的鍵盤，num: 播放聲音的號碼/ key: 對應的鍵盤ASCII/ type黑鍵或白鑑
    display_keys: [
      {num: 1,key: 90  ,type:'white'},
      {num: 1.5,key: 83  ,type:'black'},
      {num: 2,key: 88  ,type:'white'},
      {num: 2.5,key: 68  ,type:'black'},
      {num: 3,key: 67  ,type:'white'},
      {num: 4,key: 86  ,type:'white'},
      {num: 4.5,key: 71  ,type:'black'},
      {num: 5,key: 66  ,type:'white'},
      {num: 5.5,key: 72  ,type:'black'},
      {num: 6,key: 78  ,type:'white'},
      {num: 6.5,key: 74  ,type:'black'},
      {num: 7,key: 77  ,type:'white'},
      {num: 8,key: 81  ,type:'white'},
      {num: 8.5,key: 50  ,type:'black'},
      {num: 9,key: 87  ,type:'white'},
      {num: 9.5,key: 51,type:'black'},
      {num: 10,key: 69  ,type:'white'},
      {num: 11,key: 82  ,type:'white'},
      {num: 11.5,key: 53  ,type:'black'},
      {num: 12,key: 84  ,type:'white'},
      {num: 12.5,key: 54  ,type:'black'},
      {num: 13,key: 89  ,type:'white'},
      {num: 13.5,key: 55  ,type:'black'},
      {num: 14,key: 85  ,type:'white'},
      {num: 15,key: 73  ,type:'white'}
    ]
  },methods:{
    //播放音符，附上 id音符號碼/volume(0-1)音量
    playnote: function(id,volume){
      if (id>0){
        //抓到audio中data-num=id的那個聲音DOM物件
        var audio_obj=$("audio[data-num='"+id+"']")[0];
        //調整音量/倒帶到頭/播放聲音
        audio_obj.volume=volume;  
        audio_obj.currentTime=0;
        audio_obj.play();
      }
    },
    playnext: function(volume){
      //從notes(樂譜)裡面抓出第now_note_id筆資料
      var play_note=this.notes[this.now_note_id].num;
      
      //播放音符，引數有音符號碼、音量
      this.playnote(play_note,volume);
      
      //把現在正在播放的音符位置移動到下一個
      this.now_note_id+=1;
      
      //如果現在位置移動完超出了樂譜的長度
      if (this.now_note_id>=this.notes.length){
        //清除正在驅動的player計時器
        clearInterval(this.player);
        //現在播放時間歸零
        this.playing_time=0;
        //停止播放
        this.stopplay();
      }
      
    },
    //開始錄音
    start_record: function(){
      //把錄音時間重置
      this.record_time=0;
      //定義一個新的計時器，控制錄製時間+1
      this.recorder=setInterval(function(){
        vm.record_time++;
      });
    },
    //停止錄音
    stop_record: function(){
      //關掉計時器
      clearInterval(this.recorder);
      //把錄製時間重置
      this.record_time=0;
    },
    //開始播放
    startplay: function(){
      //現在指向的音符位置=0
      this.now_note_id=0;
      //現在播放時間歸零
      this.playing_time=0;
      //下一個音符=0
      this.next_note_id=0;
      
      //為了要在setInterval裡面能夠存取this，用一個vobj當變數裝他
      var vobj=this;
      //播放的計時器
      this.player=setInterval(function(){
        // console.log(vobj.playing_time);
        //如果現在播放時間>下一個音符的時間的話
        if (vobj.playing_time>=vobj.notes[vobj.next_note_id].time){
          //播放下一個音符，下一個音符的index+=1
          vobj.playnext(1);
          vobj.next_note_id++;
        }
        //播放時間+1
        vobj.playing_time+=1;
      },2);
    },
    //結束播放
    stopplay: function(){
      //清除正在驅動的player計時器
      clearInterval(this.player);
      
      //現在指向的音符位置=0
      this.now_note_id=0;
      //現在播放時間歸零
      this.playing_time=0;
      //下一個音符=0
      this.next_note_id=0;
      
      setTimeout(function(){
        //現在播放時間歸零
        this.playing_time=-1;
      },20);
      
    },
    //傳入音符id，看現在是否正在播放他，有的回傳true，沒有回傳false
    get_current_highlight: function(id){
      //如果譜沒有長度就直接跳出去
      if (this.notes.length==0)
        return false
      //cur_id 上一個播放的音符id
      var cur_id=this.now_note_id-1;
      //如果cur_id<0會發生錯誤，歸零
      if (cur_id<0) cur_id=0;
      //取得現在的播放音符
      var cur_text=this.notes[cur_id].num;
      // 如果播放的跟傳進來的音符一樣，回傳true，不然就會執行到最後回傳false
      if (cur_text==id) return true;
      return false
    },
    //加入音符到樂譜(如果現在正在錄製中)，然後播放
    addnote: function(id){
      //如果正在錄製中(錄製時間>0)，就推一個音符資料(音符號碼/播放時間)進去樂譜
      if (this.record_time>0)
        this.notes.push({num:id,time: this.record_time});
      //播放這個音
      this.playnote(id,1);
    },
    load_sample: function(){
      var vobj=this;
      $.ajax({
        url: "http://awiclass.monoame.com/api/command.php?type=get&name=music_dodoro",
        success: function(res){
          vobj.notes=JSON.parse(res);
        }
      });
    }
    
  }
})
//如果按下鍵盤
$( window ).keydown(function(e) {
  //抓到傳進來事件資料的鍵盤代號
  var key=e.which;
  //設定vue裡面正在按的鍵，給顯示用
  vm.now_press_key=key;
  console.log(key);
  //從鍵盤清單裡面尋找，如果有對應到key值一樣的，就播放/加入譜那個音
  for(var i=0;i<vm.display_keys.length;i++){
    if (key==vm.display_keys[i].key)
      vm.addnote(vm.display_keys[i].num);
  }
  
});
//如果離開鍵盤
$( window ).keyup(function(){
  //設定vue裡面正在按的鍵為-1，清空
  vm.now_press_key=-1;
});