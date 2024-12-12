---
layout: post
title: "jekyll - 기능을 추가해보자!"
date: 2024-12-12 13:38:42 +0900
tags: [jekyll, UI/UX]
categories: [jekyll, 기능추가, comment ,syntax highlight]
---
<br>
글쓰고, 확인하고는 작동하니 작은 기능, ui들을 추가해보기로했다. 
포스트마다 코멘트달기, 포스트에 신텍스 하이라이트 달기, tag로 post 나열하기의 기능을 추가해보았다. 
<br><br>
<br><br>


### 1.  포스트 코멘트
<br>
`Utterances를` 이용해서 만들기! 생각보다 쉽당.
깃에서 제공하는 오픈소스 댓글 시스템이다. github에서 제공하는 issue를 활용하여 github계정만 있다면 댓글을 추가할 수 있다.
단, 해당 레포가 public일때만 가능하다.
<br>
[utterances 바로가기](https://utteranc.es/?installation_id=58205949&setup_action=install)
이 사이트 들어가서 설정 하면 됨. 한개도 안어려움. 
1. 내 레포 경로 입력하기. 
- 주로 ‘user-name/repo-name’으로 되어있다. 
- 나는 ‘yes-eul-jeong/blog’를 입력했다. 
2. 이슈 매핑 선택하기
- 종류가 여러가지가 있는데 나는 jekyll을 사용하다보니 페이지 경로가 파일명이라 첫번째것으로 선택했다. 
3. 라벨 붙이기
- 나는 일단 공란으로 두었다!
4. 테마 선택하기
- 일단 github-lighit를 선택하고 블로그 내 유저가 선택한 모드에따라 Light와   dark 를 쓸 예정이다. 
5. 위에것들을 고르고나면 script태그를 알아서 생성해준다. 해당 태그를 복사하여 comment를 사용할 html파일에 붙여넣기 해주면 된다. 
<br>

나는  comment기능은 post에서만 사용할것이므로  `_layout/post.html` 파일에 붙여넣어줬다.
<br>

```html 
//post.html의 맨 하단
<script src="https://utteranc.es/client.js"
        repo="yes-eul-jeong/blog"
        issue-term="pathname"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>
```

이게 잘 적용되어 실행되는지 확인해본 후 테마를 적용할 예정이다. 내 생각대로 github-light버전의 comment ui가 잘 보인다. 
배포 후 실행되는지도 확인 후 넘어가자!
코멘트를 남기려면 해당 레포에 `urrterances`를 설치해줘야한다.
[utterances action](https://github.com/apps/utterances)
설치할 때 권한을 어디에 줄 건지 선택하는게 있는데 그냥 전체 레포 선택하지말고 'select repo'를 선택해서 레포를 선택해주자!
<br><br>

+ 컬러테마를 안넣을거고 색변하는게 필요없다면 위의 과정까지만 하면 된다!
하지만 나는 light/dark모드별로 넣고싶어 아래처럼 짰다. 
1. DOM이 생성되고, localstorage에 theme을 가져다 쓴다. 만약 theme이 없다면 유저의 OS설정에 따라 모드를 설정해준다. 
2. script태그를 만들어주고, 안에 설정을 똑같이 추가해준다. 
3. script태그안에 theme속성만 선언한 변수 theme을 넣어 변수로 넣어준다. (지금은 theme의 값이 dark와 light 밖에 없지만 나중에 추가될경우 수정해줘야한다.)
<br>

```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        let theme = localStorage.getItem('theme');
        if(!theme) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };
        
        const script = document.createElement('script');
        script.src = "https://utteranc.es/client.js";
        script.setAttribute("repo", "yes-eul-jeong/blog");
        script.setAttribute("issue-term", "pathname");
        script.setAttribute('theme', `github-${theme}`);
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;
        document.body.appendChild(script);
    });

</script>
```

이렇게 할 경우, theme을 선택할 때 마다 바로 바뀌지 않고 새로고침을 했을 경우 localstorage의 값을 가져와 적용된다. 
새로고침하지 않고도 테마가 바뀔 때 마다 comment를 바꾸고싶다. 이건 나중에 자세히 다루겠다. 
이번 스텝의 목표는 `utterances` 을 이용한 comment달기가 성공적으로 작동하고,  선택한 theme을 제대로 반영하여 script가 써지는지 확인하는 정도만 헀다.

<br><br>

### 2. 신텍스 하이라이트

 <br>

`rouge` 를 이용하여 신택스 하이라이트를 달아보겠다. 
 `rouge` 와 `jekyll` 은 둘 다 `ruby` 기반이라 `rouge` 를 골랐다. 
이제 적용해보자!
<br>

1. 원하는 rouge 테마를 골라준다. 
[테마고르기](https://spsarolkar.github.io/rouge-theme-preview/)
2. root폴더에서 해당 명령어를 실행해 테마를 다운받아준다.
- ‘gruvbox.dark’에 내가 고른 테마명을 넣으면 된다. 위 사이트에서 테마를 고르면 ‘current selection:고른 테마 이름’이 나온다.  
```
rougify style gruvbox.dark > assets/css/syntax.css
```
<br>

- 나는 css파일을 다운 후  scss파일로 변경해줬다. layout.scss에서 import해서 사용하는데 css파일이 import가 안되는 문제가 있어 그냥 scss로 바꿔줬다. 
- 폴더 위치도 assets/css에서 _sass로 옮겨줬다. 
3. _config.yml 설정하기
아래 코드를  _config.yml 파일에 넣어준다. `auto_ids`와 `hard_wrap`은 없어도 되는 값 같다. 안넣는 글도 많았다. 

```yml
highlighter: rouge
markdown: kramdown
kramdown:
  input: GFM
  auto_ids: true //필수 아닌듯 주석지워야함
  hard_wrap: false  //필수 아닌듯 주석 지워야함
  syntax_highlighter: rouge
```

4. css파일 적용하기
  1. 내가 사용한 방법
  - 나는 _sass폴더에 syntax.scss파일을 옮겨 assets/css/loader.scss에 @Import해서 해당 파일을 가져왔다. 
  - 이렇게하면 내가 loader.scss파일을 사용하는 모든 페이지에서 이 syntax.scss파일을 쓸 수 있다. (불필요하다.)
  2. 다른 사용 방법(추천)
  - assets/css/syntax.css파일을 그냥 두고 내가 사용할 레이아웃.html 파일에만 link로 가져와 사용한다. 
  - post.html에서만 사용할것 같으니, 해당 html  head에 넣어줘도 된다. 

  ```html
  //post.html
  //중략
  <head>
      <link rel="stylesheet" href="{{'/assets/css/syntax.css' | relative_url }}">
  </head>
  //하략
  ```

+ code 태그의 여백이 마음에 안들어  padding과 margin을 조금 넣었다. 
```css
.highlighter-rouge {
  margin: 20px 5px; /* 가장 바깥 태그에 마진 넣음 */
}
.highlight, .highlight .w {
  padding: 5px; /* 배경이 되는 박스에 패딩 넣음 */
  color: #f8f8f2;
  background-color: #272822;
}
```


<br>
<br>

### 3. tags추가

tag를 갖다 쓰는건데 내 상식에선 조금 이해가 안되는 부분이 있었다. 근데 뭐... jekyll이 그렇게 하라면 하는거지뭐! ~~꼬우면 내가 개발해야지 머!!~~

단계는 아래 스탭 정도인거같다. 
1. _layout/tag.html 생성
2. _post/’포스트'.md의 front matter에 tags: [’태그이름’,’태그이름2’]  생성
3. tags/’태그이름'.md 생성
4. ‘태그이름'.md작성
5. 태그 리스트 보여주기

#### 1. tag.html 생성
taglist가 보여지는 화면해서 해당 태그를 누르면 보여질 화면을 짜줍니다. 저는 간단하게 리스트 뿌려주게 짰어용


```
---
layout: default
---
<h2 class="post_title">태그: 여기엔 원래 페이지 닷 태그가 쓰여있다. </h2>

<ul>
 <!-- jekyll의 빌드시 liquid가 꼬이는 문제가 있는것 같다. 리퀴드를 code태그 내에 작성해도 이를 인지해 코드로 보이지 않는다. -->
 <!-- 이곳엔 대충 지킬의 for와 tag를 반복해서 노출시켜줄 코드가 있다.  -->
  
</ul>

```

![tag code 이미지](/assets/img/2024-12-12-tag-nav-code.png)

<br>


#### 2. _post/’포스트'.md의 front matter에 tags: [’태그이름’,’태그이름2’]  생성

front matter작성에 주의점이 있더라. 
‘키: 값’ 형식인데 ‘키:’와 ‘값’ 사이에 띄어쓰기 한 칸이 없으면 인지를 못한다. 꼭! 띄어쓰기 한 칸 해주자. ‘키'와 ‘:’ 사이에는 띄어쓰기 하지 말자! 

```
---
layout: post
title: "jekyll - 사용을 해보자!"
date: 2024-12-03 20:30:03 +0900
tags: [jekyll, new project] //여기 이 부분 추가. categories말고 tags
---

# jekyll다루는 법 알아보기
//sample post 중략
```

#### 3. tags/’태그이름'.md 생성 / ‘태그이름'.md작성
 프로젝트 root폴더에 tags폴더를 생성해준 후 ‘태그이름'.md파일을 생성해준다. 
나는 ‘jekyll.md’와 ‘new-project.md’를 만들어주었다. 

```
//jekyll.md
---
layout: tag
tag: jekyll
permalink: /tags/jekyll/
---
//new-project.md
---
layout: tag
tag: new project
permalink: /tags/new-project/
---
```

놀랍게도 front matter만 작성하면 된다. 
그런데 태그가 추가될 떄 마다 이걸 하나하나 작성해야한다는 생각이 좀 까마득하긴 하다.
categories도 아니고 tags인데... 원래 태그는 한 개시물에 여러개 다는거 아닌가?ㅠㅠ
#jekyll #jekyll_어렵다 #play_w_coding #today #tags #mood 

<br>

#### 5. 태그 리스트 보여주기

나는 header에 nav태그 만들어서 tag들을 뿌려줬다. 
[지킬의 변수들](https://jekyllrb-ko.github.io/docs/variables/)을 참고하여 만들었지만 자세히 나와있지 않아 결국 GPT에게 물어보며 작성했다. 

```html
//default.html
//생략
 <nav class="long-header-item">
     {% for tag in site.tags %}
     <a href="{{site.baseurl}}/tags/{{tag[0]| slugify}}" class="d-inline-block p-2 tag-name">
       {{ tag[0] }}
        <span class="tag-count">
         {{ tag[1].size | default: 0}}
        </span>
     </a> 
    {% endfor %}
 </nav> 
//생략
```
<br>
여기까지하면 잘 보일거다. 
<br>
여기까지 jekyll을 이용해 블로그를 만들며 느낀점은...
역시 공식 페이지의 설명은 빈약하고, 언어의 장벽이 느껴진다. <br>
또한 배포시 url을 꽤나 신경써야한다는 것과 디자인 없이  css를 짜는게 생각보다 귀찮다는것이다. 
나머지는 새롭고 재밌었다. <br>
아직 할게 많이 남아있어 이만 작성하러 가보겠다!