---
layout: post
title: "jekyll - color theme를 만들자!"
date: 2024-12-08 12:44:35 +0900
tags: [jekyll, UI/UX]
---

# 블로그에 컬러테마 넣기

<br>

개발자들이 선호하는 다크/라이트모드를 넣어보려한다.
이전에 내가 사용했던 방식은 css의 미디어쿼리를 이용해 prefer color scheme에 따라 색을 다르게 주는 방식으로했다.
하지만 위의 방법은 내 기기가 다크모드라면 다크모드로만, 라이트모드라면 라이트로만 보인다.
기본 os에 설정된 모드와 관계없이 유저가 해당 사이트 내에서는 모드를 자유롭게 바꿀 수 있게 해봤다.
'라이트'버튼과 '다크'버튼 두 개를 유저가 클릭 할 수 있게 하고, 클릭시 모드가 변경되며, 로컬스토리지에 설정한 값을 저장해두어 사이트를 재접속하더라도 모드가 유지되도록 하였다.

아래는 default.html코드이다.
모드 선택 하는 버튼을 대게는 footer나 안쪽으로 숨기나 나는 지금 기능이 많은것도 아니고 자랑하고싶으니 헤더에 떡하니 박아넣을것이다.
<br/>
<br/>

```html
<head>
  <!-- head생략 -->
</head>

<body class="container">
  <header class="d-flex justify-content-between pt-5 pb-4">
    <a href="{{site.baseurl}}/" class="fs-2 post_title">예슬 블로그</a>
    <nav>
      <!-- 태그생략 -->
    </nav>
    <div class="theme">
      <button id="theme-light" class="btn btn-outline-secondary">light</button>
      <button id="theme-dark" class="btn btn-outline-secondary">dark</button>
    </div>
  </header>
  <div id="content">
    <!-- content생략 -->
  </div>

  <footer class="py-3">copyright &copy{{site.time | date: "%Y"}}</footer>
</body>
```

<br/>
<br/>

위에있는 light버튼과 dark버튼을 각각 클릭시 작동되게 코드를 짰다.
참고로 아래의 코드는 개선된 코드이다. 개선 전 코드와 어떻게 개선했는지 보고싶으시면 [여기]({{ site.baseurl }}{% post_url 2024-12-09-Refactoring-color-theme-code %})를 클릭하시오.
<br/>
<br/>

```js
//default.html의 script 부분
document.addEventListener("DOMContentLoaded", () => {
  const setTheme = (theme = null) => {
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Could not save theme to localStorage:", error);
    }
  };

  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme);

  ["dark", "light"].forEach((theme) => {
    const button = document.getElementById(`theme-${theme}`);
    if (button) {
      button.addEventListener("click", () => setTheme(theme));
    }
  });
});
```

root에 컬러를 변수로 지정해줬다. 나중에 수정하기 편하려고...
위에 js를 따라 body 혹은 html에 테마에맞는 클래스가 추가되고 그 클래스 안에서 color를 지정해줬다.


```css
/* _sass/main.scss */
:root {
  --bg-color-light: #fff;
  --bg-color-dark: #000;

  --box-color: rgb(0, 0, 0, 0.05);
  --color1-light: #ccc;
  --color2-light: #999;
  --color3-light: #000;
  --color1-dark: #666;
  --color2-dark: #999;
  --color3-dark: #fff;
  --color-hyperlink-light: #007bff;
  --color-hyperlink-dark: #75b8ff;
}

body.theme-light {
  background-color: white;
  color: black;
  background-color: var(--bg-color-light);
  color: var(--color3-light);
  .post_title {
    color: var(--color3-light);
  }
  .post_data {
    color: var(--color1-light);
  }
  .post_excerpt {
    color: var(--color2-light);
  }
  .box-color {
  }
}
body.theme-dark {
  background-color: black;
  color: white;
  .post_title {
    color: var(--color3-dark);
  }
  .post_data {
    color: var(--color1-dark);
  }
  .post_excerpt {
    color: var(--color2-dark);
  }
}
```

끝!
