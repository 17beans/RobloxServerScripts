# 프로젝트 설명
로블록스 스크립트 개발자의 코드 유출률을 낮추기 위해 개발자가 등록한 게임에서만 lua 스크립트를 다운로드하여 실행될 수 있게 도와주는 API.

# 프로젝트 구성
### Stacks
- JavaScript
- express, body-parser
- Vercel

### 폴더 구조 및 파일
- index.js: Routing 코드 작성.
- Routes/: Routing에 대한 CallBack 함수들이 작성된 파일들이 위치하는 폴더.
- Routes/[Owner-GameName].js: Routing CallBack 함수가 작성되는 파일. request로 게임 정보와 스크립트 이름을 받고, string 타입의 lua 스크립트를 resopnse.
- [Owner-GameName]/: 게임 정보 등록용 js파일과 게임에 사용될 lua 스크립트들이 string 형태로 js파일에 저장되는 폴더
- [Owner-GameName]/AuthenticatedGameIDs.js: 게임 정보를 등록하는 파일. request가 오면 제일 먼저 해당 파일에 게임 정보가 등록되어 있는지 Routes/[Owner-GameName].js에서 확인 및 response.
- [Owner-GameName]/[Script Name].js: 가져올 lua 스크립트에 대한 구분을 위해 Roblox Studio 상 스크립트 파일의 이름과 비교하여 일치하는 스크립트를 다운로드할 수 있도록 하는 역할.

# 설치 방법
```bash
yarn
```

# 사용법
1. index.js에 추가할 게임에 대한 Routing 코드 추가
2. 추가할 게임에 대한 폴더 생성, AuthenticatedGameID.js 파일 생성 및 게임 정보 등록, Roblox Studio에서 작성한 서버 스크립트 코드 string 형태로 작성하여 export default로 js 파일 생성
3. Routes 폴더에 게임에 대한 js파일 생성, Authenticated.js와 lua 스크립트 작성된 js파일 import 및 Request에 대해 lua 코드를 response하는 Routing 콜백 함수 작성.
4. 배포 및 서버 실행
  ```bash
  yarn start
  ```
3. 

- Roblox Studio의 기능을 수행할 스크립트 파일의 내용으로 아래 스크립트를 복사/붙여넣기 후 API 서버 링크를 baseUrl 변수에 알맞게 기재합니다. (게임 정보와 스크립트 이름을 통해 인증 후 코드를 가져옵니다.)
```lua
local HttpService = game:GetService('HttpService')
local baseUrl = 'https://[vercel.app link]/[Owner-GameName]/%s/%s'
local GID, PID, CID = game.GameId, game.PlaceId, game.CreatorId
local requestScriptName = script.Name
local formatedUrl = string.format(baseUrl, ('%s-%s-%s'):format(GID, PID, CID), requestScriptName)
local response = HttpService:JSONDecode(HttpService:GetAsync(formatedUrl))
local success = response.success
local code = response.code
if not success then warn('[Server] LoadString fail: ', requestScriptName) end
if success then
	loadstring(code)()
end
```


# 버그 및 디버그
HTTP 통신으로 API에서 가져온 스크립트를 LoadString()하는 코드는 숨길 수 없어, 간단하게 GameID로만 인증했던 방식에서 보완하여 [GameID]-[PlaceID]-[OwnerID] 로 인증되도록 게임 스크립트와 API 서버 코드 변경.
