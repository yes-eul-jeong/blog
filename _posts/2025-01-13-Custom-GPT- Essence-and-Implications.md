---
layout: post
title: "Custom GPT의 본질과 시사점"
date: 2025-01-13 20:21:28 +0900
tags: [ study, GPT ]
categories: []
---


### GPT?
:모든 컴퓨터의 원리처럼 request/response의 원리로 동작
- 대화 맥락을 유지하는것은 이전 대화 내용을 배열 형태로 request에 포함시켜 전달하기 때문임
  ->맥락은 유지되나 토큰의 증가로 *비용 증가* 문제 발생

이를 극복하고자**RAG/파인튜닝/메모리**기능이 논의됨  
 
[LLM최적화](https://platform.openai.com/docs/guides/optimizing-llm-accuracy/rag-fine-tuning#expander-1, "OpenAI")
  - RAG(Retrieval-Augmented Generation) : 외부 지식베이스의 문서를 임베딩한 후, 사용자 질문과 유사도가 높은 문서를 실시간 검색(retrieval)하여 답변 생성에 활용.  
  *장점*: 지식 업데이트 없이도 최신 정보 반영 가능. 추론X
  - 파인튜닝(fine-tuning) : 모델을 개선하여 최적화된 추론까지 하지만 시간과 비용이 많이 발생, 실시간에 부적합
  - 메모리 : 대화 맥락을 유지하고 반복되는 환경을 전제로한다. 파인튜닝의 단점을 극복하기위해 메모리(가칭)기능이 논의중이며, 배경 지식을 보다 쉽게 전달 할 수 있음.

### My GPT의 시사점
- gpt api 이용시 대화내역을 명세에 맞게 배열로 담아서 request 해야함
- 무한정 배열을 담을 수는 없으니, 유의미한 최근의 몇 개 배열을 추출해서 요청함(선택기능 필요)
- 새로운 주제 시작 시 기존 대화 배열을 초기화(flush)하여 토큰 효율성을 확보합니다. 


### 컨텍스트
**컨텍스트(context)?**
: 컨텍스트는 대화의 맥락을 의미하며, 챗봇의 동작 원리에서 컨텍스트 관리가 핵심 오소로 작용한다. 
공식문서, 챗 API, 메시지 설명: 챗봇의 작동 원리와 관련된 공식 문서와 API, 메시지 구조에 대한 설명이 필요하다.  
[OpenAI 컨텍스트 관리 가이드](https://platform.openai.com/docs/guides/text-generation/conversations-and-context)


### 챗봇의 기본 원리
1. 질문과 답변:
  - 질문은 독립적으로 학습된 모델에 전달되어 벡터 임베딩(vector embedding)으로 변환된다.
  - 추론 엔진을 통해 요청을 보내고 응답을 받는다.
1. 대화 맥락 관리:
  - 대화 맥락(컨텍스트)을 배열로 관리하며, 최근 열 번의 대화만 유지한다(유저의 선택에 따라 다를 수 있음).
  - 새로운 질문 시 맥락을 초기화하고, 새로운 채팅 시작 시 배열을 클리어한다.
  - 데이터베이스에 저장 여부는 유저의 선택에 달려 있다.

### 시스템 메시지 역할과 컨텐츠
1. 역할 : 모델이 어떤 역할을 해야하는지 지침을 주는 역할. 성격, 대화의 목표, 금지된 주제 등 지침을 설정하여 모델이 대화 내내 사용자의 기대에 맞는 방식으로 응답하도록 돕는다. 또한 프롬프트 인젝션 공격 방지에도 기여한다. 
1. 컨텐츠: 시스템(system), 유저(user), 어시스턴트(assistant) 역할로 나뉜다.
   - system : 대화의 시작에 주어지는 지침으로, 대화의 맥락을 설정하고 모델의 행동 방식을 정의하는 역할.AI가 일관된 방식으로 사용자와 상호작용할 수 있게 함. AI가 대화에서 어떤 역할을 해야 하고, 어떤 스타일로 답변해야 하며, 특정 제한 사항이나 규칙이 있는지를 명확하게 지정
   - user : AI를 사용하는 이용자. AI를 통해 정보를 얻거나 도음을 요청하며 대화의 방향을 주도한다.(질문, 요청, 명령 / 사용자의 상황 설명 / 추가적인 정보 요청이나 의견)
   - Assistante : 사용자의 요청에 따라 답변을 제공하거나 문제를 해결하는 역할.시스템 메시지에서 정의된 지침에 따라 응답하며, 사용자가 원하는 정보를 이해하고 그에 맞는 해결책을 제시하는 역할을 수행. 
### 시스템 메시지 예시
```json
{
  "role": "system",
  "content": "You are a helpful AI assistant specialized in machine learning. Respond in Korean and provide code examples when needed."
}

### 비용 효율적인 접근
1. SaaS(Software as a service) 모델: 정액제 서비스에서 캐시 서버를 두어 중간 단계를 유지할 것으로 추측된다.
1. 파인튜닝과 RAG:
  - 파인튜닝: 비용과 시간 소모가 큼.
  - RAG: 실시간 업데이트에 유리하며, 서치 수준의 정보 제공.

### 기술적 고려 사항
1. 컨텍스트의 한계: 신경망을 활용한 파인 튜닝과 벡터화된 데이터 활용.
1. 모델 업그레이드: 비용과 시간 소모, 벡터의 역할.
1. 실시간 정보 업데이트: RAG의 장점으로 실시간 정보 업데이트 가능.

### 결론
1. 챗봇의 대화 메모리 기능(Dialogue Memory): 대화 맥락을 유지하고 효율적으로 관리하기 위한 기술 개발.
1. 비용 효율적인 접근과 실시간 정보 업데이트의 중요성.
