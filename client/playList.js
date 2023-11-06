const playList_link = document.querySelector('.playList_link');
const historyHTML = document.querySelector('.history');
const resultsList = document.querySelector('#results')

playList_link.addEventListener('click',()=>{
  console.log(hi);
    getPlayLists().then(showPlayLists);
});
const getPlayLists=()=>{
  return fetch(`/spotify/playlists`).then(res=>res.json());
}

function showPlayLists(response) {
  const results = response.items;
    resultsList.innerHTML=``;
    results.forEach(playList => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = playList.name;
      a.href = '/spotify/playlist/songs?id=' + playList.id+"&name="+playList.name;
      console.log(a.href);
      li.appendChild(a);
      resultsList.appendChild(li);
      const br=document.createElement('br');
      resultsList.appendChild(br);
    });
  }