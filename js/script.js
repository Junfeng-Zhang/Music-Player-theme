// 获取所有事件源
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// 播放音乐功能
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// 暂停音乐功能
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// 上一首功能
function prevMusic(){
  musicIndex--; // 将 musicIndex 减 1
  //如果 musicIndex 小于 1，则 musicIndex 将是数组长度，因此最后一首音乐播放
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// 下一首功能
function nextMusic(){
  musicIndex++; // 将 musicIndex 增加 1
  // 如果 musicIndex 大于数组长度，则 musicIndex 将为 1，因此第一首音乐播放
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// 播放或暂停按钮事件
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  // 如果 isPlayMusic 为真，则调用暂停音乐，否则调用播放音乐
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

// 上一首音乐按钮事件
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

// 下一首音乐按钮事件
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// 根据音乐当前时间更新进度条宽度
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; // 当前正在播放歌曲 
  const duration = e.target.duration; // 获取播放歌曲总时长
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // 更新歌曲总时长
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ // 如果 sec 小于 10，则在它之前添加 0
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // 更新播放歌曲当前时间
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ // 如果 sec 小于 10，则在它之前添加 0
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// 根据进度条宽度更新当前播放歌曲 
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; // 获取进度条的宽度
  let clickedOffsetX = e.offsetX; // 获取偏移量 x 值
  let songDuration = mainAudio.duration; // 获取歌曲总时长
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); // 调用 playMusic 函数
  playingSong(); // 调用 playingSong 函数
});

// 更改播放模式
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; // 获取到这个标签innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "单曲循环");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "随机播放");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "列表循环");
      break;
  }
});

// 歌曲结束后要做什么
mainAudio.addEventListener("ended", ()=>{
  // 如果用户已将图标设置，将根据图标方式进行操作。
  // 循环歌曲然后将重复当前歌曲并相应地进行播放。
  let getText = repeatBtn.innerText; // 获取到这个标签innerText
  switch(getText){
    case "repeat":
      nextMusic(); // 调用 nextMusic 函数
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; // 将音频当前时间设置为 0
      loadMusic(musicIndex); //用参数调用 loadMusic 函数，参数中有当前歌曲的索引 
      playMusic(); // 调用 playMusic 函数
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); // 生成具有最大数组长度范围的随机索引/数字
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); // 这个循环运行直到下一个随机数与当前的音乐索引不同
      musicIndex = randIndex; // 将随机索引传递给音乐索引。
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

// 单击音乐图标时显示音乐列表
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// 根据列表的数组长度创建 li 标签
for (let i = 0; i < allMusic.length; i++) {
  // 从数组中传递歌曲名称、作者
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); // 在 ul 标签中插入 li

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    // 歌曲进度条
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ // 如果 sec 小于 10，则在它之前添加 0
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //  通过歌曲的总持续时间。
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); // 添加具有总持续时间值的 t-duration 属性
  });
}

// 播放列表中的特定歌曲 点击 li 标签。
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    // 如果 li 标签索引等于 musicIndex 则在其中添加播放类
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

// 特定的点击功能
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; // 单击 li 索引更新当前歌曲索引。
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}