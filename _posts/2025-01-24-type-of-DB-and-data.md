---
layout: post
title: "DB의 종류와 data type"
date: 2025-01-24 19:22:51 +0900
tags: [  ]
categories: []
---



## RDBMS란?

**Relational Database Management System**의 약어로, 관계형 데이터베이스 관리 시스템을 의미한다. 데이터를 테이블 형식으로 저장하고 관리하는 시스템.
각 테이블은 행(row)과 열(column)로 구성되며 테이블 간의 관계를 설정할 수 있다.

- **종류**: MySQL, PostgreSQL, Oracle DB...

<br/>

### 다른 DB관리 시스템에는 어떤 것이 있을까?
1. **NoSQL**: 문서(document), 키-값(key-value), 그래프(graph), 컬럼(column) 기반의 다양한 모델의 DB를 지원. MongoDB, Cassandra, Redis, Neo4j 등이 이에 해당된다.
2. **NewSQL**: RDBMS의 ACID 특성을 유지하면서도 NoSQL의 확장성을 제공하는 DB.
3. **객체지향 DB**: 객체지향 프로그래밍 언어와 통합되어 객체를 DB에 저장하는 방식. db4o, ObjectDB, Versant Object Database...
4. **그래프 DB**: 데이터 간의 관계를 그래프로 표현한 방식. Neo4j, Amazon Neptune, ArangoDB...

> **ACID?**
> - **Atomicity(원자성)**: 트랜잭션 내 모든 작업이 성공되거나, 하나라도 실패 시 전체 트랜잭션이 롤백되어야 한다. (ex: 계좌이체)
> - **Consistency(일관성)**: 트랜잭션이 완료된 후 DB가 일관된 상태를 유지해야 한다.
> - **Isolation(고립성)**: 각 트랜잭션들이 서로 영향을 미치면 안 됨. 여러 사용자의 DB 동시 접속 시에도 데이터의 무결성을 유지하기 위해 필요함.
> - **Durability(지속성)**: 트랜잭션이 성공적으로 완수되면 영구히 DB에 저장되어야 함. 에러 발생 시에도 결과는 손실되어선 안 됨.

<br/>

---

<br/>

[DB를 설정해보자!](https://github.com/zidell/awesome-study/wiki/study-%EA%B3%B5%EC%9A%A9-%EB%94%94%EB%B9%84%EC%A0%91%EC%86%8D-%EC%A0%95%EB%B3%B4)

프로젝트 명과 테이블 이름을 bar(-)로 구분하고 테이블 이름에 추가 필드가 필요하다면 언더바(_)로 구분하기로 했다.

- **DB Name**: `${프로젝트명}-${테이블 이름}_${추가 필드가 필요한 경우1}_${추가 필드가 필요한 경우2}`

<br/>

---

<br/>

## Encoding(인코딩)과 Collation(콜레이션)?

텍스트를 저장하고 비교하는 방식을 결정하는 중요한 설정. 다국어 지원이 필요한 애플리케이션에서 중요한 역할을 한다.

### Encoding?

텍스트 데이터를 저장할 때 사용하는 문자 집합을 의미한다.

- **종류**: UTF8mb4, UTF-8, UTF-16, ASCII...
- **UTF-8**: 전 세계 대부분의 언어를 지원하는 인코딩 방식
- 인코딩을 잘못 설정하면 특정 언어의 문자가 깨져 보일 수 있음. 프로젝트 요구사항에 맞는 인코딩을 선택하는 것이 중요. 무작정 크게 설정하면 오히려 저장공간 낭비, 성능 최적화 안 됨, 대역폭 낭비 등의 문제가 생김.

### Collation?

텍스트 데이터를 비교하고 정렬하는 방식을 결정.

- a와 A를 구분할지, 특정 언어 정렬 규칙을 따를지를 정함.
- 다국어 지원이 필요할 경우, 적절한 콜레이션을 선택하여 정렬 및 비교할 수 있음.

> ### utf8mb4_0900과 unicode_ci
> 1. **utf8mb4_0900**: 
>   - MySQL 8.0에서 도입된 콜레이션 시리즈. 최신 유니코드 표준을 따르고 있으며 유니코드 9.0을 기반으로 더욱 정확한 문자 비교와 정렬이 가능함.
>   - UTF-8의 확장 버전으로 4byte까지 지원함.(이모지 사용 가능)
>
> 2. **unicode_ci**:
>   - 대소문자를 구분하지 않는 콜레이션. A와 a를 같은 문자로 취급.
>   - 주로 utf8 인코딩과 함께 사용되며 비교적 최신 유니코드 표준을 따르지 않음.
>   - 3byte까지 지원 → 이모지 지원 안 함.

<br/>

---

<br/>

## Data type

DB 시스템에 따라 다소 다르지만 일반적으로 사용되는 타입이 있다.

<br> 

### 1. 숫자

1. **INT, INTEGER**: 정수형 데이터 타입, TINYINT, SMALLINT, MEDIUMINT, BIGINT 등으로 세분화됨.
2. **FLOAT, DOUBLE**: 부동 소수점 숫자. 소수점이 있는 숫자를 지정할 때 사용.
3. **DECIMAL, NUMERIC**: 고정 소수점 숫자. 정확한 소수 계산이 필요할 때 사용.

 [(클릭)부동소수점과 고정소수점 자료](https://gsmesie692.tistory.com/94)

> **FLOAT과 DOUBLE, DECIMAL과 NUMERIC?**
>  - 소수점을 포함한 숫자를 저장한다.
>  - **FLOAT과 DOUBLE**
>    - 부동 소수점을 저장. 아주 작은 숫자를 저장할 때 유리하다.
>    - FLOAT은 대개 4byte, DOUBLE은 대개 8byte로 정밀도의 차이가 있다.
>    - 아주 큰 범위의 숫자를 다루지만 정밀도가 아주 중요하지 않을 때 사용.(그래픽 처리, 대략적 온도와 같은 과학적 계산)
>  - **DECIMAL과 NUMERIC**
>    - 고정 소수점을 저장.
>    - 소수점 이하 자릿수를 정확하게 지정할 수 있음 (금융 계산처럼 정확도가 필요한 정보).
>    - 일부 DB에서 다르게 처리될 수 있지만 대개 동일하게 취급된다.

<br>
### 2. 문자

- **CHAR(n)**: 고정 길이 문자열. n개의 문자 길이를 가지며, 짧은 문자열을 지정할 때 사용.
- **VARCHAR(n)**: 가변 길이 문자열. 최대 n개의 문자열을 지정할 수 있다.
- **TEXT**: 긴 문자열. 크기에 따라 TINYTEXT, MEDIUMTEXT, LONGTEXT로 나뉜다.

<br>

### 3. 날짜와 시간

- **DATE**: 날짜를 저장할 때 사용.( YYYY-MM-DD )
- **TIME**: 시간을 저장할 때 사용. ( HH:MM:SS )
- **DATETIME**: 날짜와 시간을 함께 저장할 때 사용.
- **TIMESTAMP**: UNIX 타임스탬프 형식으로 날짜와 시간을 저장.
- **YEAR**: 연도를 저장할 때 사용.

<br>

### 4. 이진 데이터 타입

- **BINARY(n)**: 고정 길이 이진 데이터
- **VARBINARY(n)**: 가변 길이 이진 데이터
- **BLOB**: 큰 이진 데이터. 크기에 따라 TINYBLOB, MEDIUMBLOB, LONGBLOB...

<br>

### 5. 기타 타입

- **BOOLEAN**: true / false를 저장할 때 사용
- **ENUM**: 미리 정의된 값 중 하나를 선택할 수 있는 문자열
- **SET**: 미리 정의된 값들의 집합을 저장할 수 있는 문자열.
  
<br/>

---

## Forge와 Docker?

배포할 때 사용하는 도구

### 1. Forge

- 서버 관리와 배포 자동화에 중점을 둠
- Laravel 애플리케이션을 위한 서버 관리 도구.
- 서버 프로비저닝, 서버 설정, 배포 자동화, DB 백업, SSL 인증 관리 등

> [(클릭)서버 프로비저닝?](https://jins-dev.tistory.com/entry/%ED%94%84%EB%A1%9C%EB%B9%84%EC%A0%80%EB%8B%9DProvisioning-%EC%9D%B4%EB%9E%80)

### 2. Docker

- 애플리케이션의 컨테이너화로 어디서든 일관된 실행을 도와주는 도구
- 애플리케이션을 컨테이너라는 독립된 환경에서 실행할 수 있게 해주는 플랫폼
  - **컨테이너?** 애플리케이션과 그 종속성을 함께 패키징하여 어디서든 일관되게 실행 가능하게 함.
- 애플리케이션의 이식성, 확장성, 격리성 제공. 일관된 개발-운영 환경 유지

| 기능 | Forge | Docker |
|---|---|---|
|주요 용도 | Laravel 전용 배포 | 컨테이너 기반 배포|
| 학습 곡선 | 낮음(GUI 기반) | 중간~높음 |
| 실행환경 | 물리 서버 | 모든 플랫폼 |
| 확장성 | 수직 확장 | 수평 확장 |
|적합한 규모 | 중소형 프로젝트 | 대규모 분산 시스템 |

--------
