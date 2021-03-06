---
layout: page
title:  "Git 명령어 정리"
permalink: /doc/
---

<br/>

# <img src="https://git-scm.com/images/logo@2x.png">

<br/>

## 1. 설정과 초기화

> 전역 사용자명/이메일 구성하기

- git config - -global user.name “Your name”
- git config - -global user.email “Your email address”

> 저장소별 사용자명/이메일 구성하기 (해당 저장소 디렉터리로 이동후)

- git config user.name “Your name”
- git config user.email “Your email address”

> 저장소별 설정 정보 조회

- git config - -list

> Git의 출력결과 색상 활성화하기

- git config - -global color.ui “auto”

> 새로운 저장소 초기화하기

- mkdir /path/newDir
- cd /path/newDir
- git init

> 새로운 원격 저장소 추가하기

- git remote add <원격 저장소> <저장소 url>

<br/>

## 2. 기본적인 사용법

> 새로운 파일을 추가하거나 존재하는 파일 스테이징하고 커밋하기

- git add . 또는 git add * (모두 업데이트)
- git commit -m “<메시지>”

<br/>

## 3. 브랜치

> 추후에 작성예정

<br/>

## 4. Git 이력

> 모든 이력 보기 (추후에 작성예정)

<br/>

## 5. 원격 저장소

> 저장소 복제하기

- git clone <저장소>

> origin 저장소에서 변경 사항을 가져와 현재 브랜치에 합치기

- git pull <원격 저장소>

> 새로운 로컬 브랜치를 원격 저장소에 푸싱하기

- git push <원격 저장소> <지역 브랜치>

> origin 저장소에 master로 합치기

- git push origin master
