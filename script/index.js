

const loadLessons=()=>{
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res)=>res.json())
    // .then((json)=>console.log(json.data));
    .then((json)=>displayLesson(json.data));
    
}



const displayLesson=(lessons)=>{
    // console.log(lessons);
    //step 1 : get the container
  const lavelContainer = document.getElementById("lavel-container");
  lavelContainer.innerHTML = "";

  // 2  : get into every lession and creatye element
  for (let lesson of lessons) {
    // 3   : create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
                 <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})"  class="btn btn-outline btn-primary lesson-btn" >
                 <i class="fa-solid fa-book"></i>LESSON-${lesson.level_no}</button>
    `;
    //4 :append container
    lavelContainer.append(btnDiv);
  }

};

// leson e click korle sob word load hoye dekhabe 

const loadLevelWord = (id) => {
  manageSpinner(true);
//   console.log(id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  // console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((info) => {

      // eituku holo color er jonno 
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      // console.log(clickBtn);
      clickBtn.classList.add("active");

      displayLevelWord(info.data);
    });
};

// load lavel word  e load korte parchi ekhon eita dekhate hobe
const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";



  // word e kichu na thakle 
  if (words.length == 0) {
    wordContainer.innerHTML = `
        <div class=" text-center col-span-full bg-slate-200 p-10 rounded-3xl space-y-6 font-bangla">

        <img class="mx-auto" src="./assets/alert-error.png">
            <p class="text-xl font-medium">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-4xl ">নেক্সট Lesson এ যান</h2>
        </div>
        `;
    manageSpinner(false);
    return;
  }


  // word e data thakle 
  words.forEach((word) => {
    // console.log(word);
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white  rounded-xl py-10 px-5 space-y-4">
            <h2 class="text-xl font-bold ">${word.word ? word.word : "pauajayni"}</h2>
            <p class="font-semibold">Meaning /Pronunciation </p>
            <div class="text-xl semibold font-bangla">"${word.meaning ? word.meaning : "ortho paua jayni"}/${word.pronunciation ? word.pronunciation : "pronunciation painai"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-slate-300 hover:bg-slate-400 "><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-slate-300  hover:bg-slate-400"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>

        `;

    wordContainer.append(card);
  });
  manageSpinner(false);
};

//  detail e click korle modal open hobe 
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  // console.log(url);
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

// modal e data dekhanor jonno
const displayWordDetails = (word) => {
  // console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
    <div class="">
             <h2 class="text-2xl ">${word.word}(<i class="fa-solid fa-microphone-lines"> </i> : ${word.pronunciation})</h2>

        </div>
        <div class="">
             <h2 class="text-xl ">meaning </h2>
             <p>${word.meaning}</p>

        </div>
        <div class="">
             <h2 class="text-xl ">example </h2>
             <p>${word.sentence}.</p>

        </div>
        <div class="">
             <h2 class="text-xl ">synonym </h2>
             <div class="">${createElement(word.synonyms)}</div>

        </div>
    `;
  document.getElementById("word_modal").showModal();
};


function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
// class button er upor theke color soranor jonno 
const removeActive = () => {
  const lessonButton = document.querySelectorAll(".lesson-btn");
  lessonButton.forEach((btn) => {
    btn.classList.remove("active");
  });
};

// synonym er jonno button 
const createElement = (arr) => {
  // console.log(arr);
  const htmlElements = arr.map((el) => `<span class="btn"> ${el}</span>`);
  return htmlElements.join(" ");
};

// spinner ghuranor jonno 
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner")?.classList.remove("hidden");
    document.getElementById("word-container")?.classList.add("hidden");
  } else {
    document.getElementById("word-container")?.classList.remove("hidden");
    document.getElementById("spinner")?.classList.add("hidden");
  }
};

loadLessons();