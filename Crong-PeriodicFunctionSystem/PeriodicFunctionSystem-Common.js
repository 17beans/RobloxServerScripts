export const LuaCodeCommon = `local module = {}



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Services //--
local Players = game:GetService('Players')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
----



--// Presetup //--

----



--// Types //--

----



--// Constants //--
local fPeriodicFunctionSystemReplicated = ReplicatedStorage.PeriodicFunctionSystem


module.MessageType = {
	['Hint'] = 'Hint',
	['Message'] = 'Message',
}
----



--// Remotes / Bindables //--
local fPeriodicFunctionSystemRemotes = fPeriodicFunctionSystemReplicated.Remotes
local REvtAlert = fPeriodicFunctionSystemRemotes.Alert
----



--// Modules //--

----



--// Variables //--

----



--// Functions //--
function module.AlertAllClient(messageType, messageArr)
	REvtAlert:FireAllClients(messageType, messageArr)
end

function module.GetAmountWithProbability(totalCount: number, Probability: number)
	local playerCount = math.ceil(totalCount * Probability)

	return playerCount
end

function module.GetCertainPlayers(playerList, count)
	local selectedPlayers = {}
	while #selectedPlayers < count do
		local randomIndex = math.random(1, #playerList)
		local selectedPlayer = playerList[randomIndex]
		if not table.find(selectedPlayers, selectedPlayer) then
			table.insert(selectedPlayers, selectedPlayer)
		end
	end
	return selectedPlayers
end
----



--// Setup //--

----



--// Main //--

----



return module
`