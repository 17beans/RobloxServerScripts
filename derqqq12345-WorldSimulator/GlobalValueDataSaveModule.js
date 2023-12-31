export const LuaCodeGlobalValueDataSaveModule = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외의 사람이
 분석, 참고, 이용하는 등 유출 행위를 금합니다.
 Copyright 2023. bean7189 All rights reserved.
]]




--// Service //--
local DataStoreService = game:GetService('DataStoreService')
local HttpService = game:GetService('HttpService')
----



--// Presetup //--
local Config = script.Parent.Config
local DataStoreName = Config.DataStoreName.Value
local DataStore = DataStoreService:GetDataStore(DataStoreName)
----



--// Types //--

----



--// Constants //--
local TargetFolder = Config.TargetFolder.Value
assert(TargetFolder, '데이터 감시 폴더가 지정되지 않았습니다. TargetFolder ObjectValue의 Value를 설정해주세요.')
assert(TargetFolder:IsA('Folder'), 'TargetFolder의 Value는 Folder 속성만 설정 가능합니다. 데이터 감시 폴더를 다시 지정해 주세요.')

local INTERVAL_DATA_SAVE = Config.DataSaveInterval.Value
----



--// Remotes / Bindables //--
local BFncResetDataStore = script.Parent.ResetDataStore
----



--// Modules //--

----



--// Variables //--

----



--// Functions //--
local function GetDataStoreData(DataStore: DataStore, DataStoreKey: string)
	local data
	local s, e
	local attemptCount = 7
	repeat
		s, e = pcall(function()
			data = DataStore:GetAsync(DataStoreKey)


			attemptCount -= 1
		end)
	until s or attemptCount == 0

	if not s then
		warn(('[%s] GetDataStoreData error:'):format(script.Name), e)
	end


	return data
end

local function SetDataStoreData(DataStore: DataStore, DataStoreKey: string, data: any)
	local s, e
	local attemptCount = 7
	repeat
		s, e = pcall(function()
			if data == '' or not data then
				DataStore:RemoveAsync(DataStoreKey)
			else
				DataStore:SetAsync(DataStoreKey, data)
			end


			attemptCount -= 1
		end)
	until s or attemptCount == 0

	if not s then
		warn(('[%s] SetDataStoreData error:'):format(script.Name), e)
		return
	end

	print('데이터 저장 성공')
end


-- TargetFolder 디렉토리 구조 테이블로 파싱 및 리턴
local function ParseDataStructure(targetTable: {}, parseInstance: Folder|StringValue|NumberValue|BoolValue|Color3Value|BrickColorValue|Vector3Value|CFrameValue)

	-- 디렉토리 구조가 너무 길어지면 대기 시간 필요할 수 있음
	--task.wait()

	if parseInstance:IsA('Folder') then
		local key = parseInstance.Name
		if not targetTable[key] then targetTable[key] = {} end
		for _, v: Folder|StringValue|NumberValue|BoolValue|Color3Value|BrickColorValue|Vector3Value|CFrameValue in parseInstance:GetChildren() do
			ParseDataStructure(targetTable[key], v)
		end

	elseif
		parseInstance:IsA('Color3Value')
		or parseInstance:IsA('BrickColorValue')
		or parseInstance:IsA('Vector3Value')
		or parseInstance:IsA('CFrameValue')
		or parseInstance:IsA('StringValue')
		or parseInstance:IsA('NumberValue') or parseInstance:IsA('IntValue')
		or parseInstance:IsA('BoolValue')
	then
		if #parseInstance:GetChildren() > 0 then
			warn(("%s는 Folder가 아닌 ValueBase이므로 내부에 개체를 가질 수 없습니다. 데이터 구조에 문제가 있으며, 하위 값들은 무시됩니다."):format(tostring(parseInstance)))
			return
		end

		local valueName = parseInstance.Name
		local value = parseInstance.Value
		if parseInstance:IsA('Color3Value') then
			local stringedValue = tostring(value)
			targetTable[valueName] = stringedValue..'_Color3'
		elseif parseInstance:IsA('BrickColorValue') then
			local stringedValue = tostring(value)
			targetTable[valueName] = stringedValue..'_BrickColor'
		elseif parseInstance:IsA('Vector3Value') then
			local stringedValue = tostring(value)
			targetTable[valueName] = stringedValue..'_Vector3'
		elseif parseInstance:IsA('CFrameValue') then
			local stringedValue = tostring(value)
			targetTable[valueName] = stringedValue..'_CFrame'
		else
			targetTable[valueName] = value
		end

	else
		warn('Error in ParseDataStructure. parseInstance is a: ', parseInstance.className)
	end


	return targetTable

end


local function GetStoredData()
	local storedData = GetDataStoreData(DataStore, DataStoreName)
	return storedData
end

local function SaveTargetFolderData()
	print('데이터 저장 시도...')
	local parsedDataStructure = ParseDataStructure({}, TargetFolder)[TargetFolder.Name]
	local encoded = HttpService:JSONEncode(parsedDataStructure)
	SetDataStoreData(DataStore, DataStoreName, encoded)
end


local function CheckValueType(valueName: string?, value: string|number|boolean|Color3|BrickColor|Vector3|CFrame)
	if valueName then
		local isColor3 = string.find(valueName, '_Color3')
		local isBrickColor = string.find(valueName, '_BrickColor')
		local isVector3 = string.find(valueName, '_Vector3')
		local isCFrame = string.find(valueName, '_CFrame')
		local isString = typeof(value) == 'string'
		local isNumber = typeof(value) == 'number'
		local isBoolean = typeof(value) == 'boolean'

		assert(
			isColor3
				or isBrickColor
				or isVector3
				or isCFrame
				or isString
				or isNumber
				or isBoolean,
			('value type is not supported. value type: %s'):format(typeof(value))
		)


		return isColor3, isBrickColor, isVector3, isCFrame, isString, isNumber, isBoolean
	else
		local isColor3 = string.split(value, '_Color3')[1]
		local isBrickColor = string.split(value, '_BrickColor')[1]
		local isVector3 = string.split(value, '_Vector3')[1]
		local isCFrame = string.split(value, '_CFrame')[1]
		local isString = typeof(value) == 'string'
		local isNumber = typeof(value) == 'number'
		local isBoolean = typeof(value) == 'boolean'

		assert(
			isColor3
				or isBrickColor
				or isVector3
				or isCFrame
				or isString
				or isNumber
				or isBoolean,
			('value type is not supported. value type: %s'):format(typeof(value))
		)


		return isColor3, isBrickColor, isVector3, isCFrame, isString, isNumber, isBoolean
	end
end


local function CreateDataStructure(parsedTable: {}, targetInstance: Folder|StringValue|NumberValue|BoolValue|Color3Value|BrickColorValue|Vector3Value|CFrameValue)

	for k, v in parsedTable do
		local categoryOrValueBase = targetInstance:FindFirstChild(k)
		if typeof(v) == 'table' then
			local category = categoryOrValueBase
			if not category then
				category = Instance.new('Folder')
				category.Parent = targetInstance
				category.Name = k
			end
			CreateDataStructure(v, category)

		elseif
			typeof(v) == 'string'
			or typeof(v) == 'number'
			or typeof(v) == 'boolean'
		then
			local newValue = v
			local ValueBase: StringValue|NumberValue|BoolValue|Color3Value|BrickColorValue|Vector3Value|CFrameValue = categoryOrValueBase

			if not ValueBase then
				print('값 생성')
				local isColor3, isBrickColor, isVector3, isCFrame, isString, isNumber, isBoolean = CheckValueType(k, v)
				if isColor3 then
					ValueBase = Instance.new('Color3Value')
					local color3 = string.split(newValue, '_Color3')[1]
					local nameTable = string.split(color3, ', ')
					newValue = Color3.new(nameTable[1], nameTable[2], nameTable[3])
				elseif isBrickColor then
					ValueBase = Instance.new('BrickColorValue')
					local brickColor = string.split(newValue, '_BrickColor')[1]
					newValue = BrickColor.new(brickColor)
				elseif isVector3 then
					ValueBase = Instance.new('Vector3Value')
					local vector3 = string.split(newValue, '_Vector3')[1]
					local nameTable = string.split(vector3, ', ')
					newValue = Vector3.new(nameTable[1], nameTable[2], nameTable[3])
				elseif isCFrame then
					ValueBase = Instance.new('CFrameValue')
					local cframe = string.split(newValue, '_CFrame')[1]
					local nameTable = string.split(cframe, ', ')
					newValue = CFrame.new(nameTable[1], nameTable[2], nameTable[3], nameTable[4], nameTable[5], nameTable[6], nameTable[7], nameTable[8], nameTable[9], nameTable[10], nameTable[11], nameTable[12])
				elseif isString then
					ValueBase = Instance.new('StringValue')
				elseif isNumber then
					ValueBase = Instance.new('NumberValue')
				elseif isBoolean then
					ValueBase = Instance.new('BoolValue')
				end
				ValueBase.Parent = targetInstance
				ValueBase.Name = k

			else
				print('값 변경')

				local isColor3 = ValueBase:IsA('Color3Value')
				local isBrickColor = ValueBase:IsA('BrickColorValue')
				local isVector3 = ValueBase:IsA('Vector3Value')
				local isCFrame = ValueBase:IsA('CFrameValue')
				if isColor3 then
					local color3 = string.split(newValue, '_Color3')[1]
					local nameTable = string.split(color3, ', ')
					newValue = Color3.new(nameTable[1], nameTable[2], nameTable[3])
				elseif isBrickColor then
					local brickColor = string.split(newValue, '_BrickColor')[1]
					newValue = BrickColor.new(brickColor)
				elseif isVector3 then
					local vector3 = string.split(newValue, '_Vector3')[1]
					local nameTable = string.split(vector3, ', ')
					newValue = Vector3.new(nameTable[1], nameTable[2], nameTable[3])
				elseif isCFrame then
					local cframe = string.split(newValue, '_CFrame')[1]
					local nameTable = string.split(cframe, ', ')
					newValue = CFrame.new(nameTable[1], nameTable[2], nameTable[3], nameTable[4], nameTable[5], nameTable[6], nameTable[7], nameTable[8], nameTable[9], nameTable[10], nameTable[11], nameTable[12])
				end
			end
			--print('기존 값: ', ValueBase.Value)
			ValueBase.Value = newValue
			--print('변경된 값: ', ValueBase.Value)

		else
			warn('Error in CreateDataStructure. typeof v: ', typeof(v))
		end
	end

end


local function SetupDataStructureToTargetFolder()
	-- 데이터 불러오기
	local jsonData = GetStoredData()
	-- 저장된 데이터가 없다면 첫 접속이므로 디렉토리 구조 탐색하여 데이터 구조 생성
	--print('DataStore first data: ', jsonData)
	if not jsonData then
		local parsed = ParseDataStructure({}, TargetFolder)[TargetFolder.Name]
		--print('Parsed TargetFolder data: ', parsed)
		jsonData = HttpService:JSONEncode(parsed)
	end
	local data = HttpService:JSONDecode(jsonData)
	--print('DataStore second data: ', data)

	-- [Developer] 디렉토리 구조 제대로 스캔 및 생성하는지 테스트하는 코드
	--TargetFolder:ClearAllChildren()
	--task.wait(6)

	CreateDataStructure(data, TargetFolder)
end
----



--// Setup //--

----



--// Main //--
BFncResetDataStore.OnInvoke = function()
	local s, r
	repeat
		s, r = pcall(function()
			DataStore:RemoveAsync(DataStoreName)
		end)
	until s

	warn('데이터가 초기화 되었습니다.')
	return true
end

-- [Developer] 데이터 초기화
--local response = BFncResetDataStore:Invoke()
--repeat task.wait() print('waiting...') until response

-- DataStore 읽기 및 TargetFolder에 디렉토리 구조 생성
SetupDataStructureToTargetFolder()


task.spawn(function()
	while true do
		task.wait()

		task.wait(INTERVAL_DATA_SAVE)
		SaveTargetFolderData()
	end
end)
----`