날씨 api
https://openweathermap.org/

동영상파일
https://www.pexels.com/ko-kr/search/videos/Clear%20sky/

icon
https://fonts.google.com/

todo

1. v 현재 시간 실시간으로 보여주기(2/22)
2. v 현재 위치 가져와서 기본 날씨 보여주기
3. v 돋보기 아이콘 클릭 시 input box 노출 되며 도시 검색 기능 제공(클릭/enter)
   - input에 포커스 기능 추가
4. v 시간별 예측(4일 96 타임스탬프) 가져와 4개씩 그룹으로 페이징 하기(토글,아코디언스타일) → free 제공 안됨
   => 5일간 3시간마다의 예보 는 free 제공 됨
   => 날짜 형식 커스텀=> 방법 찾아보고 안되면, 라이브러리(http://momentjs.com/ )=>.substr(5, 11) 기본문법으로해결=> 문법이 바뀌었다능,
   https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/substring
   https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/substr

5. - 날씨에 따라 배경 동영상 변경
6. v 에러 핸들링: 없는 도시 입력 / 영어가 아닌경우? https://curryyou.tistory.com/208/
7. v 검색어 태그 기능 : 검색한 단어는 태그로 저장:
   => 클릭 시 날씨 랜더
   => x 버튼 삭제
8. v api key 숨기라고
   GitGuardian에서 메일 왔다;;=> api 키 다른파일로 빼고 gitignore 처리

**10. - 날씨에 따라 배경 동영상 변경**

11. v tag 중복 시 추가안되는 기능
    v 5개 까지 보여주고 추가 되는 태그는 앞에서 부터 지우기
    v 태그 박스 위치 변경

**12. - 코드리팩토링**

13. x 검색 기능 => autocomplete

배열.join(""); => 배열을 그릴때 나타나는 쉼표 지우기 ","
참고
https://velog.io/@chloe_park/Javascript-14.weather-API-%ED%98%B8%EC%B6%9C%ED%95%98%EA%B8%B0

섭씨 = (Kelvin u2013 273.15)
켈빈 = (섭씨 + 273.15)

main 날씨 icon으로 나타내야 하는 case list 확인
clear
clouds
rain
thunderstorm
snow
mist
Drizzle

mist
Smoke
Haze
Dust
Fog
Sand
Dust
Ash
Squall
Tornado
