---
layout: post
title: "코드개선 - color theme 코드 개선안"
date: 2024-12-09 19:32:28 +0900
categories: jekyll 코드개선 color theme Refactoring
---

코드 개선

jekyll로 만든 블로그에 light/dark모드를 추가하기위한 코드를 생성했다. 내가 초기 작성한 코드는 아래와 같다.

`prefers-color-scheme`이 있는지 확인, 유저의 적용 테마가 다크인지, 라이트인지 확인한다.
미리 적용된 테마가 있다면 그 테마로 적용시킨다.
없다면 light모드가 기본이다.
light와 dark버튼이 있으며 해당 버튼을 클릭하면 해당하는 테마로 바뀐다.

```js
document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  const themeLight = document.getElementById("theme-light");
  const themeDark = document.getElementById("theme-dark");

  const applyTheme = (theme) => {
    document.body.classList.remove("theme-light", "theme-dark");
    if (theme == null) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  };
  applyTheme(theme);
  themeLight.addEventListener("click", () => applyTheme("light"));
  themeDark.addEventListener("click", () => applyTheme("dark"));
});
```

위에 코드가 생각나는 대로 작성한 코드를 1차로 다듬어 작동하게 만든 코드이다.
위 코드를 피드백 받아 아래처럼 수정하였다.

```js
document.addEventListener("DOMContentLoaded", () => {
  const applyTheme = (theme = null) => {
    if (theme === null) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);

    localStorage.setItem("theme", theme);
  };

  const theme = localStorage.getItem("theme");
  applyTheme(theme);

  ["dark", "light"].forEach((theme) => {
    document
      .getElementById(`theme-${theme}`)
      .addEventListener("click", applyTheme.bind(null, theme));
  });
});
```

1. 사용 하는 것끼리 묶기.
   - 앞서 사용된 theme, themeLight, themeDark와 같은 선언된 변수를 사용하는 곳에 가까이 두어 뭉쳐주었다.
   - 변수선언의 의도가 명확해진다. 어떤 함수에서 사용되는지 알 수 있어졌다. applyTheme에 사용되는 theme 변수가 잘못 할당되는것을 피할 수 있다.
2. 중복된 사용 지우기.
   - 사용하는 곳끼리 묶으니 중복된 사용이 눈에 띄었고 중복 사용되는곳을 묶었다.
   - 아래의 코드에서, 만약 Pink, green, yellow, bold등등의 테마가 추가될 경우 코드의 줄 수가 계속 늘어난다.
   - 하지만 중복되는 것을 묶어주면 간결하게 작성할 수 있다. 또한 배열에 단어만 추가해주면 되니 유지보수가 수월해진다.

```js
themeLight.addEventListener("click", () => applyTheme("light"));
themeDark.addEventListener("click", () => applyTheme("dark"));
```

3. 변수의 타입, 기본값 명시해주기
   - `applyTheme`함수의 기본값이 어떤 값이고, 기본값이 없을 경우 어떤 값을 넣어줄지 명시해놓아 에러를 줄일 수 있다.
   - 비교연산자를 ==가 아닌 ===를 사용해 type까지 비교해 에러 발생률을 최소화 해준다.
4. 함수 사용법 변경
   - 이벤트 리스너를 `.bind`로 변경하여 `this`를 조금 더 명시적으로 표현하고 재사용성을 높일 수 있다.

이제 위에 코드를 GPT에게 보내어 개선 사항이 있는지 물어보았다.
GPT의 개선사항
:

이 코드는 사용자가 선택한 테마를 로컬 스토리지에 저장하고, 페이지가 로드될 때 저장된 테마를 적용하는 기능을 제공합니다. 또한, 사용자가 버튼을 클릭하여 테마를 변경할 수 있도록 합니다. 이 코드의 개선점을 몇 가지 제안하겠습니다.
**코드 가독성 향상**: 변수와 함수의 이름을 더 명확하게 지정하여 코드의 가독성을 높일 수 있습니다.
**이벤트 리스너 중복 제거**: 이벤트 리스너를 추가하는 부분을 더 간결하게 작성할 수 있습니다.
**초기 테마 설정 로직 개선**: 초기 테마 설정 로직을 조금 더 명확하게 작성할 수 있습니다.
**에러 처리 추가**: 로컬 스토리지 접근 시 발생할 수 있는 에러를 처리할 수 있습니다.
개선된 코드는 다음과 같습니다:

```js
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

개선 사항 설명:

**함수 및 변수 이름**: applyTheme를 setTheme로 변경하여 더 명확하게 테마를 설정하는 함수임을 나타냈습니다.

**이벤트 리스너**: bind를 사용하지 않고 화살표 함수를 사용하여 더 간결하게 이벤트 리스너를 추가했습니다.

**로컬 스토리지 에러 처리**: 로컬 스토리지에 접근할 때 발생할 수 있는 에러를 try-catch 블록으로 처리하여 안정성을 높였습니다.

**버튼 존재 여부 확인**: 버튼이 존재하는지 확인한 후 이벤트 리스너를 추가하여 잠재적인 오류를 방지했습니다.
<br><br>
나머지는 이해가 갔지만 bind를 arrow function으로 바꾼 부분이 궁금해 추가 질문을 해보았다. GPT의 대답은 아래와 같았다.
<br>
<br>

- `arrow function`은 코드가 간결하고 `this`바인딩을 자동으로 처리하므로, 이벤트 리스너와 같은 간단한 상황에서는 더 적합할 수 있다. `bind`는 `this`를 명시적으로 설정해야하거나 함수의 재사용성이 중요한 경우에 더 적합하다.

- `arrow function`이 가독성이 높음으로 복잡하지 않은 해당 경우와 같은 상황에서는 `arrow function`이 코드가 깔끔하고 이해하기 쉬어진다.

- 이벤트 리스너에서 `this`를 사용하지 않으므로 `this`의 컨텍스트를 명시적으로 표햔할 필요까진 없다.

위와같은 이유라면 이 상황에선 `bind`가 아닌 `arrow fucntion`을 사용하는게 맞는것같다!
