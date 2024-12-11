---
layout: post
title: "jekyll - 세팅을 해보자!"
date: 2024-12-03 19:32:28 +0900
tags: [jekyll, new project]
---

# jekyll 프로젝트에 적용하기

먼저 루비, 루비잼 등의 개발환경 세팅이 필요함.
루비는 2.4.0이상의 버전이 필요함.
루비 버전 확인 : rudy -v
루비잼 버전 확인 : gem -v
GCC 와 Make도 필요하다함.
`gcc -v`
`g++ -v`
`make -v`
으로 버전 확인하기. 설치안되어있으면 설치해야함.

지킬 홈페이지에 설명이 잘 나와있긴한데! 함 정리해보겠습니다.
맥os기준으로 설명할게요

## 루비설치하기!

루비가 설치 안되어있다면 여길보고 하시오 설치되어있는데 버전이다르거나하면 바로아래로

> 설치하려면?
>
> `xcode-select --install`
>
> 위 명령어로 Native확장기능을 컴파일 할 수 있게 해야한단다. 뭔말인지는 모름.
>
> 1. 홈브루 설치하기. 만약 설치되어있으면 건너뛰기
>
> `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
>
> 2. 루비 설치하기
>
> `brew install ruby`
>
> 3. 루비의 경로를 쉘 환경설정에 추가하기
>
> `echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.bash_profile`
>
> 4. 터미널 재시작하기
>
> 5. 루비 설정 확인하기
>
> `which ruby`

### 루비 업데이트하기!

루비가 설치되어있지만 버전이 최신이 아닐경우?
rbenv를 이용해 버전관리를 해줘야함니다.
지킬 홈에선 2.6.3이상이면 작동한다하는데 안돼서 최신으로 업데이트 해부림

```
# Homebrew 설치
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# rbenv 와 ruby-build 설치
brew install rbenv

# 쉘 환경에 rbenv 가 연동되도록 설정
rbenv init

# 설치상태 검사
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/master/bin/rbenv-doctor | bash
```

자 위에건 루비 버전관리를 위한 env를 설치한 과정이고 성공적으로 완료되었다면 아래를 따르면 됩니다. 만약 성공적으로 안됐다면? 홈브루 버전 문제일 가능성도 있음. 재설치 후 다시 ㄱㄱ

```
rbenv install -l // 설치가능 루비 리스트를 보여줍니다. 가장 최신버전으로 인스톨 하면 됩니둥
rbenv install 2.6.3 //지킬홈에선 2.6.3이면 된다지만 나는 3.3.6버전으로 설치함.
rbenv global 2.6.3 // 글로벌로 버전 일치해서 설치하기. 나는 당연 3.3.6으로 설치했음
ruby -v // 바로입력하면 구버전나옴. 터미널 껐다켜서 다시 버전 확인하기!
```

제대로 내가 원하는 버전으로 업데이트 됐다면 이제 지킬 설치하자!

> 여담! 왜 터미널을 껐다 켜야 업데이트된 버전으로 보이는거지?
> 셸 초기화 문제라고 합니다.
> 터미널을 처음 실행하 ㄹ때 셸은 환경설정 파일을 읽어들여 환경변수를 설정한다고함. 이 과정에서 현제 활성화된 버전들을 결정하여 저장해두는데 이게 해당 세션동안 캐싱되어 유지된다고함. 그래서 업데이트해도 터미널을 껐다켜지 않는이상 구버전이 보이는거임. 업데이트 후 버전 확인해도 계속 구버전이라면 터미널 껐다키면 됨니둥

## jekyll 설치하기

지킬을 사용하기위한 환경세팅이 거의 완료되었다! 이제 별거 안남았다.

1. 로컬설치

```
gem install --user-install bundler jekyll //--user-install은 전역이 아닌 사용자 전용 디렉토리에 설치하는거! 전역설치 권한 없어도 가능하다. 만약 그냥 전역으로 설치하려믄 이거 뺴고 gem install bundler jekyll 하믄댐
```

2. `ruby -v` 로 루비버전 확인하여 버전 앞에 두자리 확인하기

- `echo 'export PATH="$HOME/.gem/ruby/X.X.0/bin:$PATH"' >> ~/.bash_profile`
  요기 X.X.0인 XX에 확인한 루비 버전 앞에 두자리 넣기
- 나중에 루비 업데이트돼서 저 앞자릿수 바뀌면 수정해줘야함.

3. 젬 경로가 홈 디렉토리를 바라보는지 확인하려면

```
gem env
```

이제 지킬 프로젝트 만들 수 있음

```
//새 지킬사이트 생성. 나는 Sites폴더로 이동해서 설치했음
jekyll new myblog

//이동
cd myblog
code . //에디터 실행.여기서부턴 에디터 터미널에서 하믄댐.

//빌드 후 서버에 적용
jekyll build
jekyll serve

//확인
http://localhost:4000
```

웹브라우저에서 잘 실행되는거 확인했으면 이제 깃에 레포만들어서 푸시하믄댐.
깃 레포가 퍼블릭이어야 페이지스 이용 가능. 아니면 엔터프라이즈로 결제해야함 ㅠㅠ

## 깃헙에서 Pages 설정하기

지킬 자체가 깃헙에 잘 설정 되어있어서 배포버전을 뭐 설정 안해줘도됨.
레포 > setting > pages > build and deployment > source
에서 deploy from a branch로 설정 하고
branch를 main으로 설정하고 save해주세요.
그리고
레포 > actions가서 잘 빌드되고 배포되는지 확인하고 적힌 url로 접속하면 깨져있을겁니당.
에디터로 해당 프로젝트 열어줍니다.
\_config.yml파일을 열어줍니다 baseurl을 수정해줘야합니다. 나머지는 알아서 하고싶은대로 하세용.

```yml
title: 예슬이 블로그 // 블로그 타이틀(필수x)
email: yeseal0628@gmail.com //내 이메일(필수x)
description: >- # this means to ignore newlines until "baseurl:"
  포트폴리오용 블로그입니다. 근데 이것저것 공부한거 다 올릴거임
baseurl: "/my-blog" # the subpath of your site, e.g. /blog//이 베이스 url을 내 레포이름으로 해주세용
url: "" # the base hostname & protocol for your site, e.g. http://example.com
twitter_username: jekyllrb
github_username: jekyll

# Build settings
theme: minima
plugins:
  - jekyll-feed
# Exclude from processing.
# The following items will not be processed, by default.
# Any item listed under the `exclude:` key here will be automatically added to
# the internal "default list".
#
# Excluded items can be processed by explicitly listing the directories or
# their entries' file path in the `include:` list.
#
# exclude:
#   - .sass-cache/
#   - .jekyll-cache/
#   - gemfiles/
#   - Gemfile
#   - Gemfile.lock
#   - node_modules/
#   - vendor/bundle/
#   - vendor/cache/
#   - vendor/gems/
#   - vendor/ruby/
```

baseurl을 수정해주고 다시 푸시해주시면 아마 배포버전에서도 안꼬이고 잘 작동할거에요.
근데 이제 로컬로 실행하면 404가 뜰거에요ㅠㅠ 그러면 localhost주소를
`http://localhost:4000/my-blog/`이런식으로 /레포이름해주면 됩니다 ㅇ\_<

이야~~ 이제 정말 개발만 하면된다!!

## + 기타

### 1. npm 의 버전 표기법 알아보기

npm의 버전은 .을 기준으로 주버전.부버전.수정버전으로 쓰인다.
1.2.3버전이라하면, 1은 주버전, 2는 부버전, 3은 수정버전을 의미한다.

1. ^1.2.3일경우 부버전과 수정버전 둘 다 업데이트를 허용한다는 뜻이다 .

- 1.2.4버전도, 1.3.0버전도 가능하며 최대 2.0.0 미만버전까지 사용 가능하단뜻이다. (2.0.0은 안됨.)
- 이를 caret이라 부르며 주버전이 변경되지 않는 한 부버전과 수정버전의 업데이트를 허용한다는 뜻이다.

2. ~는 Tilde라고 부르며 수정버전의 업데이트만 허용한다는 뜻이다.

- ~1.2.3 이 있다면 1.2.4나 1.2.9는 허용하지만 1.3.0부터는 허용하지 않는다는 뜻이다.
- 아무것도 붙지 않았다면? 해당 버전만 사용 가능하다는 뜻이다.
