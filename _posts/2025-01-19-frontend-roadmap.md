---
layout: post
title: "프론트앤드 로드맵 정리"
date: 2025-01-19 15:21:42 +0900
tags: [ study, 기초 ]
categories: []
---


프론트앤드 로드맵 훑어보기
===

<br>

프론트 개발자에 어느정도 가까워졌는지, 나의 수준은 어느정도인지 점검차 로드맵을 훑어보았다. 
훑어보며 알고있는 개념, 전혀 몰랐던 개념등을 정리해보았다. 

 참고: [frontend road map](https://roadmap.sh/frontend)

---

<br>

## 1. HTTP2 이해하기
  
  [http2 자료](https://velog.io/@18k7102dy/HTTP2-HTTP2%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC)

### 주요 특징과 고려사항

- **캐시 관리가 더 중요해짐.(캐시는 http1/1 에서도 있었음)**
  - 브라우저 자체의 메모리 캐시때문에 새로 바뀐 파일 내용이 적용이 안될 수 있음
  - 해결법: 파일명에 해시 추가(`style.abcd123.css`)
  - 그러나 캐시버스팅을 과도하게 사용하면 성능이 떨어질 수 있음 (파일명이 자주 바뀌면 캐시적중률이 떨어진다. )
- **prefetch 기능 추가**
  - 미리 다음 페이지 리소스 로드
  - 트래픽 과다발생 주의
  - option : 보통 nginx 레이어에서 정리함, 성능 영향 최소화하기 위함
[prefetch란?](https://dotaky99.tistory.com/9)
- **HTTP 메소드**
  - put: 전체 데이터를 전송함
  - patch: 수정할 데이터만 부분 수정


<br>

**API 디자인 스타일 비교**

  1. SOAP (Simple Object Access Protocol): REST와는 다르게, SOAP는 프로토콜이야. XML 기반으로 메시지를 교환하고, 보안이나 트랜잭션 같은 복잡한 요구사항을 처리하는 데 강점이 있어. 주로 엔터프라이즈 환경에서 많이 사용돼.
  2. GraphQL: 페이스북에서 개발한 쿼리 언어로, 클라이언트가 필요한 데이터만 요청할 수 있게 해줘. REST API는 정해진 엔드포인트에서 데이터를 가져오지만, GraphQL은 클라이언트가 원하는 형태로 데이터를 요청할 수 있어서 유연성이 높아.
  3. gRPC: 구글에서 개발한 오픈 소스 RPC(Remote Procedure Call) 프레임워크야. HTTP/2를 기반으로 하고, 프로토콜 버퍼를 사용해서 데이터를 직렬화해. 빠르고 효율적인 통신이 가능해서 마이크로서비스 아키텍처에서 많이 사용돼.
  4. Falcor: 넷플릭스에서 개발한 데이터 패칭 라이브러리로, 클라이언트가 서버의 데이터 그래프를 탐색할 수 있게 해줘. GraphQL과 비슷한 개념이지만, 넷플릭스의 특정 요구사항에 맞춰져 있어.

---

## 2. 브라우저 
<br>
**핵심요소**
- 자바스크립트 엔진(V8)
- 렌더링 엔진(Blink, Webkit)
- 리페인팅/리렌더링 과정  

**프레임워크 비교**
  - 크롬은 웹킷(webkit)에서 분기한 블링크(Blink) 엔진을 사용(사파리와 호환성 차이 있음)
  - react는 렌더링 병목을 피하기위하여 버추얼돔을 사용한다! 근데 버추얼돔 문제점(계산이 너무 많아지고 기타문제) 때문에 효율적인 알고리즘의 리얼돔이 선호되는 트랜드가 있음
  - react/vue는 런타임에서 실행되지만, svelte에서는 컴파일 시점에서 코드를 만들어냄(최근엔 리엑트도 컴파일 지원 시작, vue도 별도 프로젝트 존재)
  - svelte의 한계 : 앱이 커지면 커질수록 컴파일된 코드 용량이 너무 커진다. 작은 앱일수록 좋음 그래서 svelte5부터 개선함.

| | React | Svelte |
|---|---|---|
| 방식 | 가상 DOM | 컴파일 타임 |
| 장점 | 풍부한 생태계 | 번들 크기 작음 |
| 단점 | 복잡해지면 느려짐 | 대형 앱에선 제한적 |


---

<br>

## 3. CSS 기술

**디자인 시스템**
- 아토믹 디자인 
  - 말그대로, 원자단위로 아주 작게 쪼갠 디자인 방법
  - UI를 재사용 가능한 단위로 나누어 설계
- 미디어쿼리
  - 브라우저 혹은 디바이스의 전체 뷰포트에따라 css를 다르게 적용할 수 있게 해주는 기능
  - 거의 모든 브라우저 지원
```
@media (max-width: 768px) {
  .box {
    background-color: lightblue;
    font-size: 14px;
  }
}
```
- 컨테이너 
  - 특정 요소 혹은 컨테이너의 크기나 특성을 기준으로 css를 다르게 적용하는것. 뷰포트가 아닌 부모요소의 크기를 기준으로 변경됨.
  - 컴포넌트단위의 반응형디자인이 가능해 컴포넌트 재사용성이 좋음.
  - 최신브라우저만 지원
```
/* 컨테이너 설정 */
.container {
  container-type: inline-size;
}
/* 컨테이너 쿼리 */
@container (min-width: 400px) {
  .box {
    font-size: 20px;
  }
}
```

[컨테이너쿼리란?](https://velog.io/@yoodeok/CSS%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%BF%BC%EB%A6%ACContainer-queries)

**돔조작**
  - shadowdom과 웹컴포넌트
    - shadowdom:audio, video와 같은 태그 자체가 갖고있는거. 명시하지 않았지만 누구나 당연히 필요한것. 
    - 웹 컴포넌트 : 커스텀 HTML태그 생성 + CSS/JS격리 가능

---
<br>

## 4. package  
**npm vs deno**
- npm
  - 중앙 집중식 모듈관리
  - 서버 다운시 영향이 크다. 전 세계 배포가 멈춤.
- deno 
  - 분산 처리식 모듈 관리
  - 아직 생태계가 작다

**보안 팁**
  1. 정기적 `npm audit`
  2. 패키지 버전 고정
  3. 민감 정보 관리


## 5. graphql
  - REST는 과다/과소 조회 문제가 발생할 수 있는데 GraphQL은 **필요한 데이터만 선택** 요청 가능
  - 통신 효율적이고 편리하게 하기위해 나온거, 요청하는 측에서 요구사항을 정확히 지정할 수 있는 장점이 있음
  - 정의된 모든 값을 내려받는게 아니라 내가 필요한것만 갖다 쓸 수 있다.  → 서버측에서 권한이나 다른것을 이용해 충분히 커버 가능하다.

### 6. sse와 websocket
- SSE(Server-Sent Events)
  - 서버 → 클라이언트 방향의 단방향 통신
  - 서버가 클라이언트에게 실시간으로 데이터를 푸시하는 방식
  - HTTP기반으로, text/event-stream MIME타입사용
  - 실시간 뉴스 피드, 알림, 주가 갱신등에 사용
- WebSocket
  - 서버와 클라이언트의 양방향 통신
  - 연결을 한번 맺으면 양쪽 모두 자유롭게 데이터 전송이 가능하다. 
  - HTTP로 핸드쉐이크 한 뒤, WebSocket프로토콜 업그레이드
  - 채팅, 게임, 실시간 협업등에 유용
  
| | SSE | WebSocket |
|---|---|---|
| 방식 | 서버→클라이언트 | 양방향 |
| 사용처 | 알림 | 채팅, 게임 |
| 재연결 | 자동 | 수동 구현 |


## 공유된 사이트

- [framework7](https://framework7.io)
- [bunjs](https://bun.sh/)
- [todesktop](https://www.todesktop.com/) 
- [iconic](https://ionicframework.com/)
- [frontendloadmap kor](https://www.codeit.kr/roadmap/frontend-2023)


---

## 추가 질문정리

### 1. TCP
  1. TCP/IP 모델: 이 모델은 네트워크 통신을 4개의 계층으로 나누어 설명한다. 각각의 계층은 특정한 역할을 가지고 있음.<br/>
      - 애플리케이션 계층: 사용자와 직접 상호작용하는 부분으로, HTTP, FTP, SMTP 같은 프로토콜이 여기서 작동함.
      - 전송 계층: 데이터의 전송을 담당하는 계층으로, TCP와 UDP가 여기서 작동함. TCP는 재전송으로 데이터의 신뢰성을 보장하고, UDP는 손실 허용 대신 지연 시간 최소화를 중시함.
      - 인터넷 계층: 데이터를 목적지까지 라우팅하는 역할을 함. IP 프로토콜이 여기서 작동함.
      - 네트워크 액세스 계층: 실제 물리적인 네트워크를 통해 데이터를 전송하는 계층이.
    
  2. TCP의 역할 
  <br>
      - 연결 지향적: TCP는 데이터를 전송하기 전에 클라이언트와 서버 간에 연결을 설정해. 이걸 "3-way handshake"라고 불러.
      - 데이터의 신뢰성 보장: TCP는 데이터가 손실되거나 손상되지 않도록 보장해. 만약 데이터가 손실되면, 재전송을 통해 복구해.
      - 흐름 제어: 송신자와 수신자 간의 데이터 전송 속도를 조절해서 네트워크 혼잡을 방지해.
      - 혼잡 제어: 네트워크가 혼잡해지지 않도록 데이터 전송을 조절해.

### 2. 멀티플렉싱을 통해 처리하면 데이터가 꼬일 수 있지 않나요?

  - 스트림(Stream): HTTP/2는 각 요청과 응답을 "스트림"이라는 단위로 관리해. 각 스트림은 고유한 ID를 가지고 있어서, 여러 스트림이 동시에 전송되더라도 서로 구분할 수 있어.
  - 프레임(Frame): 스트림은 다시 작은 단위인 "프레임"으로 나누어져 전송돼. 프레임은 스트림 ID를 포함하고 있어서, 수신 측에서 어떤 스트림에 속하는 데이터인지 쉽게 식별할 수 있어.
  - 우선순위(Priority): HTTP/2는 각 스트림에 우선순위를 부여할 수 있어서, 중요한 요청을 먼저 처리할 수 있어. 이를 통해 사용자 경험을 개선할 수 있지.