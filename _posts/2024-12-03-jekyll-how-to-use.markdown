---
layout: post
title: "jekyll - 사용을 해보자!"
date: 2024-12-03 20:30:03 +0900
tags: [jekyll, how to]
---

# jekyll다루는 법 알아보기

지킬 사이트에서 단계별 튜토리얼 탭을 들어갑니다. 이미 기본 세팅은 완료했으니 코딩만 하믄 된다 하하!! <br>
튜토리얼에 나온대로 root폴더에 index.html을 추가하면 메인페이지를 해당 페이지를 바라보긴한다. 이제 튜토리얼 2섹션에 liquid를 적용하려하면 **안댐**.<br>
`{{ page.title }}` 이게 그냥 문자열로 노출됨<br>
**_장난해?_** <br>
그래서 지피티를 조졌다. 그랬더니 아래처럼 코드를 써보랬다.

```

---
layout: default
title: Home
---
// 지피티에게 물어보니 이 위에 설정(front matter)을 해줘야 인식을 한단다 참나... 이걸 왜안적어주는거람.
// 이아래는 내가 튜토리얼보고 추가로 쪼끔 작성한거
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
  </head>
  <body>
    <h1>{{ page.title }}??</h1>
    <p>Welcome to my Jekyll site!</p>
    <div>
      <h1>{{ site.title }}</h1>
  <ul>
    {% for post in site.posts %} //반복문, 조건문을 이렇게 쓴다. 약간 스벨트너낌! 스벨트를 써봤다면 낯설진 않다.
    // 여기 안에 들어가는건 _post폴더에 있는 내가 추가한 페이지들이 나온다.
      <li>
        <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
        <p>{{ post.date | date: "%B %d, %Y" }}</p>
      </li>
    {% end for %}
  </ul>
    </div>
  </body>
</html>

```

이제 빌드하고 다시 로컬로 띄어보자! 나는 잘 된다!!

자 그럼 post를 추가해보장.
아주 간단하다. 얘는 폴더구조 규칙만 잘 따라주면 알아서 처리해준다.
_post폴더를 들어가보면 샘플 코드가 있다. 그 코드 규칙에 맞춰 아래처럼 포스트 파일을 추가해준다 .
아참 파일명 저장할 땐 title을 따라서 적어주는게 관례지만 다르게 적어도 적용은 된다. ~~확장자는 md가 아닌 markdown으로 적어줘야한다!~~
확장자를 MARKUP으로 해야한다는데 예제파일도 markdown으로 되어있고 markdown으로 해도 잘 작동함. 머지?
깃에서 업로드할 땐 .md로 해야한다.

```
---
layout: post
title: "my first post!"
date: 2024-12-03 19:32:28 +0900
categories: jekyll update
---

여기에 내용을 입력하면 포스트로 들어가는거야?
네!

{{ page.title }} // page.title즉 'my first post!'가 노출되겠지? 네!
```

_posts폴더에 추가한 파일이 빌드되면 \_site폴더에 추가된다. _ site > jekyll > update 에 들어가면 내가 추가한 파일이 날짜별로 구분되어 추가되어있는걸 확인할 수 있다! markdown으로 작성된 파일이 html 로 작성되어있다.
