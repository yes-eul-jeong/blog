---
layout: post
title: "Postmessage와 PJAX를 적용해보자"
date: 2024-12-03 20:30:03 +0900
tags: [jekyll, dev, pjax]
---

postmessage를 이용해 테마가 바뀔때 마다 즉각적으로 utterances의 테마 변경을 적용하고, PJAX를 사용하여 사용자경험을 높여볼것이다. 

<br>

## 1. utterances의 테마 변경을 Postmessage를 이용하여 적용하기
``` js
//이걸 theme설정하는 함수에 넣어준다. 
const utterancesFrame = document.querySelector("iframe.utterances-frame");
    if (utterancesFrame) {
      const message = {
        type: "set-theme",
        theme: `github-${theme}`,
      };
      utterancesFrame.contentWindow.postMessage(message, "*");
      console.log(message);
    }
```
iframe을 이용하여 utterances-frame을 가져온다. 
utterances의 유무를 먼저 확인한 후 message를 보낸다. 
type은 set-theme, theme은 원하는 변경사항으로 넣으면 동적으로 해당 코멘트 부분만 변경이 가능하다. 

MutationObserver
얜.... vue에서 watch랑 비슷한 기능을 하는 애다. (작동 방식은 다르다)
특정 값이 바뀌는지를 감시해서 바뀌면 실행하는것이고, 감시 중단도 가능하다. 
localstorage의 theme값을 감시하여 변경 여부에 따라 postmessage함수를 실행시키려했다. 
근데 성능도 많이 잡아먹고 많이 사용하진 않는 함수라 적용하여 코드를 짰다가 그냥 뺏다. (빼도 작동한다)

나는 이 과정에서 theme을 담당하는 부분만 따로 js파일을 분리했다. 해당 함수가 필요한 곳에만 import시키고 불필요한 코드를 지우는 등의 과정을 한번 거쳤다. 

<br><br>
## 2.  PJAX를 사용하여 사용자 경험 높이기

PJAX란? 이 [포스팅](https://tyle.io/blog/pjax%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EA%B7%B9%EC%A0%81%EC%9D%B8-%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%86%8D%EB%8F%84-%ED%96%A5%EC%83%81?loc=ko)을 보고 적용해보기로했다. 

PJAX에 대해 간단히 설명하면
Push state + AJAX이다. 
페이지 전체를 로드하는것이 아닌 필요한 HTML조각만 가져와 특정 부분만 업데이트 하는것을 말한다. 얠 이 블로그에 어떻게 적용시킬거냐면,

1. 페이지가 바뀔때 header와 footer를 제외한 content부분만 갈아끼우기
2. a태그를 클릭했을 때 이동한 페이지의 .post-page를 갖고와서#content에 넣기
3. 링크 바꿔주기
4. 뒤로가기 해도 링크 주소 바뀌게해주기
5. 새로 가져오면 scrollTo top 해주기, 뒤로가기 앞으로가기일경우는 scroll위치 기억해주기

고로 default.html파일에 얠 넣어줄것이다. header와 footer를 제외한 content부분 갈아끼우기를 할것이다.
default.html뿐만아니라 구조가 많이 바뀐당

아래는 pjax의 구조이당. 
```js
const fetchPage = (url) => {
    return fetch(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => response.text())
      .then((data) => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html");
        var newContent = doc.querySelector("#content").innerHTML;
        document.querySelector("#content").innerHTML = newContent;

        if (document.querySelector("#post-page")) {
          console.log(`default.html:138 ?`);
          commentLoad();
        }

        // history.pushState(null, "", url);
        //새 페이지 이동했을 때 scroll top으로 이동 근데 뒤로가기,앞으로가기일땐 안바뀌게
        window.scrollTo(0, 0);
      })
      .catch((error) => console.error("Error fetching content:", error));
  };
  document.addEventListener("click", function (event) {
//이부분에서 link를 이벤트 캡처링, 버블링등의 현상때문에 div태그 등으로 인식하는 문제가 생겼었다. closest로 해결
    let link = event.target.closest("a");
    if (!link) {
      return;
    }
    event.preventDefault();
    var href = link.getAttribute("href");
    
    console.log("Anchor clicked:", href);

    fetchPage(href);
    history.pushState(null, "", href);
  });
  //뒤로가기 눌렀을 때 pjax를 이용해서 url 변경
  window.addEventListener("popstate", function (event) {
    fetchPage(location.href);
  });
```

개발자 도구를 이용해 인터넷 성능을 낮춘 상황에서 테스트해도 거의 3배가량 빠르다!

<br><br>
pjax로 페이지를 그리면 히스토리 관리도 따로 해줘야한다. 그래서 히스토리 관련 함수는 뭐가 있는지 다시 확인했다. 
spa로 개발하며 웹앱의 route만 관리하다보니 js의 history관련 함수가 헷갈렸다..!

<br>

#### 히스토리 API
popstate : 뒤로가기, 앞으로가기
replaceState:현재 히스토리를 다른 히스토리로 대체하기(덮어쓰기)
pushstate:새 히스토리 스택 추가
주로 위 세개가 쓰이고 다른것도 몇개 있다. 
history.back() : 뒤로가기
history.forward() : 앞으로가기
history.go(delta) : -1은 뒤로 1만큼, 1은 앞으로 1만큼
history.length : 스택의 길이를 반환(방문한 페이지 수)





