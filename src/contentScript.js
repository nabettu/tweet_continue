"use strict";

const endpoint =
  "https://us-central1-FIREBASE_PROJECT_NAME.cloudfunctions.net/generateTweet";
const API_KEY = "";

const continueText = async element => {
  console.log(element);
  console.log(element.childNodes);

  let tweetText = "";
  let buttonTag;
  element.childNodes.forEach(e => {
    console.log(e, ":", e.tagName);
    if (e.tagName == "BUTTON") {
      buttonTag = e;
      return;
    }
    if (e.tagName == "IMG") {
      tweetText += e.alt;
      return;
    }
    if (e.tagName == "A") {
      return;
    }
    let ceText = false;
    e.childNodes.forEach(ce => {
      if (ce.innerHTML) {
        ceText = true;
        tweetText += ce.innerHTML;
      }
    });
    if (ceText) {
      console.log("tag");
      return;
    }
    tweetText += e.innerHTML;
  });
  console.log("text:" + tweetText);
  element.removeChild(buttonTag);
  const addTextElement = document.createElement("span");
  addTextElement.innerHTML = "...";
  element.appendChild(addTextElement);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: `${tweetText}\nというツイートの続きを書いて、その続きのテキストだけを、語尾も揃えた形で返信してください。`,
      key: API_KEY,
    }),
  });
  const { data } = await response.json();
  console.log(data);
  console.log({ data });
  addTextElement.innerHTML = data.replace("「", "").replace("」", "");
};

let did = false;

window.addEventListener("popstate", function (event) {
  // URLが変更された時に実行したい処理をここに記述する
  console.log("URLが変更されました。");
  did = false;
});
window.addEventListener("pushstate", function (event) {
  // URLが変更された時に実行したい処理をここに記述する
  console.log("URLが変更されました。");
  did = false;
});
window.addEventListener("replaceState", function (event) {
  // URLが変更された時に実行したい処理をここに記述する
  console.log("URLが変更されました。");
  did = false;
});

const observer = new MutationObserver(records => {
  if (did) {
    return;
  }
  var elements = document.querySelectorAll('[data-testid="tweetText"]');
  elements.forEach(element => {
    did = true;
    const buttonElement = document.createElement("button");
    buttonElement.onclick = () => {
      continueText(element);
    };
    buttonElement.innerHTML = "続きを書かせる";
    element.appendChild(buttonElement);
  });
});
const target = document.getElementById("react-root");

observer.observe(target, { childList: true, subtree: true });

function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return [].filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}
