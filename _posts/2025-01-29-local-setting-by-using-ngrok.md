---
layout: post
title: "ngrok을 이용한 로컬 세팅"
date: 2025-01-29 14:25:52 +0900
tags: [  ]
categories: []
---



## ngrok
 서버 배포문제, DB비용 문제 등으로 배포를 하지 않고 로컬앱을 만들기로하였다. 
 하지만 잠깐 외부접속을 허용해야할 때(예를 들면 스터디)를 위해 일시적 외부접속 가능하게 해주는 서비스([ngrok](https://ngrok.com/))를 적용시킬 예정이다. 
해당 서비스는 무료버전으로 이용할 경우 약 8시간 가량만 접속이 가능하다. 
- ngrok설치하기 : `$ brew install ngrok `
- key세팅하기 : `$ ngrok config add-authtoken xxxxxxxxxxxxxxxxxxxxx`
- vscode에서 공유 할 프로젝트 실행하기 : npm run dev 
- 실행한 프로젝트의 로컬 포트번호를 입력하기 : `$ ngrok http 8080`
- 포트번호는 8080,5173,3001...와 같이 로컬 실행 하면 생기는 포트 번호
<br/>

## 프로젝트에 db연결하기
db에 더미데이터가 있다고 가정하고 진행한다. 

> +mysql2설치 <br/>
>  `$ npm i mysql2 `

추상화를 먼저 진행하자.
나는 아래와 같은 방식으로 진행했다.
<br/>
1. todoStore에 todos데이터를 가져오는 함수 선언
```
import { writable } from 'svelte/store';

export const todoData = writable([]);
export const categories = writable(['추가', '기타']);

// 초기 데이터 로드
const fetchTodoData = async () => {
	try {
		const response = await fetch('/api');
		const data = await response.json();
		todoData.set(data);
	} catch (error) {
		console.error('할 일 데이터를 가져오는데 실패했습니다:', error);
	}
};

// 앱 시작시 데이터 로드
fetchTodoData();
```

<br/>

2. db.ts생성 후 작성.

```
// db.ts, wiki참고
import mysql, { Pool } from 'mysql2/promise';

const pool: Pool = mysql.createPool({
  host: import.meta.env.VITE_DB_HOST as string,
  user: import.meta.env.VITE_DB_USER as string,
  password: import.meta.env.VITE_DB_PASSWORD as string,
  database: import.meta.env.VITE_DB_NAME as string,
  port: parseInt(import.meta.env.VITE_DB_PORT as string, 10),
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0
});

export default pool;
```

<br/>

3. +server.ts파일 생성
src > routes > api > +server.ts파일 생성

 ```
import {json} from '@sveltejs/kit';
// import conn from '$lib/db'
// $lib/ :svelte에서 제공하는 엘리아스 별칭인데 적용이 안되어 상대경로로 적었음.
import conn from '../../lib/db'

export async function GET() {
    const result = await conn.query('SELECT * FROM todos;');
    console.log('result', result);
   
    return json(result[0])
}

```
<br/>
4. 가져온 데이터에 맞춰서 todoStore수정하기.

<br/>
<br/>

> *+server.ts파일엔 뭘 적는거야?
> api라우트(앤드포인트)를 작성.
> sveltekit공식문서도 확인해야하지만 mysql2를 사용하니까 mysql문서도 확인이 필요하다. 
> 1. mysql 메서드
>   - query, execute...: mysql2공식문서 확인.
>   - [mysql2 공식사이트](https://sidorares.github.io/node-mysql2/docs)
>   - [mysql2 장점](https://blaxsior-repository.tistory.com/176)
> 2. DB 쿼리
>   - mySQL로 작성했으니 SQL쿼리를 알아야한다.
>   - SELECT * FROM ... :  테이블의 모든 데이터를 선택하라
>   - [sql 자주쓰는 query](https://365kim.tistory.com/102)


<br/>

### 포폴용 링크?
상기된 방법으로 프로젝트를 진행할 시 포폴용으로는 사용할 수 없다. 
lightsail과 dokploy는 비용 문제로 2개 이상의 프로젝트는 무리다.
vercel에서 supabase와 연동하면 500mb제공 하는 프로모션이 있어 이를 이용하려한다.
현재 파악중이다. 

<br/>

## RDBMS형 DB와 NoSQL형 디비
기존 상용되던 RDBMS와 달리 테이블 간 관계를 정의하지 않는다.
테이블간의 일관성 없음으로 나타나는 몇몇 특징으로 성능이 향상되어 빅데이터, 로그데이터 등의 데이터를 위한 db로 많이 사용되었다. 하지만 데이터가 변경될 경우 모든 컬렉션에서 수정을 해야하는 일이 발생한다. 예시로, 유저가 NAME을 변경했을 때, 변경일을 기점으로 이전 데이터들은 바뀌기 전  NAME이 적용되고, 변경일 이후에 생선되는 데이터는 바뀐 NAME이 적용된다. 
이를 해결하기 위해 유저가 변경일 이전 작성한 데이터의 모든 NAME을 수기로 수정해야한다. 


| 특징 | MySQL(RDBMS) | MongoDB(NoSQL) |
|---|---|---|
| 데이터 모델 | 테이블 기반 | 문서 기반(BSON) |
| 스키마 | 고정 스키마 필요 | 동적 스키마 |
| 트랜젝션 | ACID 지원 | 최근 버전에서 지원 |
| 확장성 | 수직 확장 위주 | 수평 확장 용이 |
| 사용 사례 |  관계형 데이터 처리 | 비정형 데이터 저장 |



--

## 이제부터 local development

- 지금까지 항상 public 배포를 위주로 해왔음. dokploy + dockploy db를 사용하였으나, 다수의 도커를 운영함에 있어 값싼 인스턴스는 무리
- vercel + RDS db에 대한 시도도 있었으나 이 방법은 취소하기로 함
- 제일 중요한 DB 서버를 값싸게 둘 방법은 따로 없어서 local mysql 서버를 운영하기로 함

### mysql 설치와 접속

맥을 사용하는 경우  brew 를 이용해 손쉽게 설치 가능

```
$ brew install mysql
```

설치가 완료되면 자동으로 시작되고, 추후에 재부팅을 해도 자동으로 계속 실행된다.

localhost 이므로 단순히 아래와 같은 단순 정보로도 접속이 가능. 

```
db : localhost
id : root
pw : 
```


- localhost로 개발시 자신의 컴퓨터 외에는 접속할 수 없다(실제로 내부네트워크안에 있다면 가능하지만, 포트 설정 등이 추가로 필요할 수 있음
- localhost를 외부에서 접속 가능하게 해주는 ngrok 모듈을 이용하기로 함
- localhost:xxxx 로 서버를 띄우고 ngrok http xxxx 를 실행하면 외부에서 접속 가능한 임시주소를 생성해줌
- $18을 내면 고정 도메인을 박을 수 있지만 어차피 그렇게 쓸 일은 없음

## RDBMS vs NoSQL

- 여러 디비 유형이 있지만 가장 크게 갈리는 유형은 이와 같다
- 대중적으로 쓸 수 있는 도구는 RDBMS=mysql, NoSQL=MongoDB가 있다. 여기에선 같은 의미로 사용한다

### RDBMS(mysql)

- 모든 데이터를 2차원의 배열(열과 오)로 구성한다
- 계층관계 및 참조관계는 다른 테이블로 구축하고, 해당 테이블의 primarykey 를 연결하는 식으로 한다(foreign key를 설정할 수도 있고, 개념적으로만 잡고 앱코드에서 다룰 수도 있음)
- mysql 최신버전에서는 json 형태도 지원한다. 하지만 nosql의 그것만큼 좋지는 않다. 
- 복잡한 관계들을 다를 수 있고, 데이터는 중복되지 않도록 정규화 되므로 일관성 문제가 없어짐
- 이에 따라 일반적인 운영 서비스의 디비로 적합

### NoSQL(MongoDB)

- Document라는 객체에 모든 필요한 값을 key - value 방식으로 다 때려박는다. 흔히 쓰는 객체를 떠올려도 됨
- primitive value 외에 js에서 사용하는 date 객체도 쌩으로 저장이 가능함
- 정형화가 필요없이 다 때려박고, 꺼내 쓰면 됨.
- 참조관계가 복잡하지 않으므로 대량의 insert에 유리
- 실제 운영시 비정형 데이의 깊은 json 데이터를 탐색하다보면, 시각적으로 관리하기 어려움
- 다른 테이블과의 참조 관계를 만들 순 있지만, 다루기가 어려움
- 로그, 대량의 데이터, 캐시, 비정형 데이터를 다룰 때 편함

## 웹서버와 데이터베이스 서버의 관계

- 웹서버와 데이터베이스는 보통 분리된 독립적인 서버임
- 웹서버는 흔히 얘기하는 백엔드 서버임. nginx가 가장 앞단에서 요청을 관할하고, 백엔드 언어(php or nodejs)등에 전달하고, 백엔드 개발자가 짠 백엔드 코드가 실행됨. 이 백엔드 코드 안에서 필요한 자료를 데이터베이스로 요청하는 거임
- 데이터베이스 서버는 보통 별도로 운영되므로 모든 데이터 교환은 연결을 기반으로함. 연결이 무리되지 않도록 관리해야함(connection & pool)
- 또한 데이터 역시 네트워크 레이턴시가 발생함. 그래서 꼭 필요한 데이터만 요청해야하고, 여러번보다 더 적은 수로 요청하는것도 필요
- 백엔드와 디비서버는 역할이 기본적으로 구분되어 있지만, 중첩도 많이 발생함
- 서비스 초기에는 코드관리가 잘 되는 백엔드가 더 많은 일들을하고, 서비스가 최적화될 수록 백엔드보다는 디비에서 SQL을 최적화하는게 더 중요해짐(index, procedure, function, partioning 등)

## SQL

- rdbms를 다루는 디비용 명령어(이것도 일종의 코드다)
- 사실상 거의 모든 디비 작업은 SQL 문으로 작성되며 대체될 수 있음
- 기본적인 select, insert, update, delete를 알아야함
- 조금 더 이해하게 되면 index, join, where, subquery 등을 공부할 수 있음
- mysql용 간단한 함수들도 있음, NOW, LEFT 등
- 최근의 백엔드에서는 ORM이라하여 코드 다루듯이 DB를 다룰 수 있는 툴을 제공하지만, 가장 근본은 역시 SQL임
- 스터디 단계에서는 SQL을 먼저이해하고, 향후 ORM을 통해서 각 도구별 특징을 이해하는게 중요

