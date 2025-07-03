-- Advanced Roblox UI Library
-- Supports theming, dragging, configurations, and complex UI elements

local UILibrary = {}
UILibrary.__index = UILibrary

-- Services
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local HttpService = game:GetService("HttpService")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

-- Configuration and Data Management
local Data = {}
Data.__index = Data

function Data.new()
    local self = setmetatable({}, Data)
    self.configurations = {}
    return self
end

local module = {}
module.Data = Data.new()

-- Utility Functions
function UILibrary.IsNotNaN(value)
    return value == value and value ~= math.huge and value ~= -math.huge
end

function UILibrary.GenUid()
    return HttpService:GenerateGUID(false)
end

function UILibrary.PackColor(color)
    return {
        R = math.floor(color.R * 255),
        G = math.floor(color.G * 255),
        B = math.floor(color.B * 255)
    }
end

function UILibrary.UnpackColor(colorTable)
    return Color3.fromRGB(colorTable.R, colorTable.G, colorTable.B)
end

-- Configuration Management
function UILibrary.SaveConfiguration(configName, data)
    module.Data.configurations[configName] = data
    -- In a real implementation, you'd save to DataStore or file
end

function UILibrary.LoadConfiguration(configName)
    return module.Data.configurations[configName] or {}
end

-- Theming System
local themes = {
    Dark = {
        Background = Color3.fromRGB(35, 35, 35),
        Secondary = Color3.fromRGB(45, 45, 45),
        Accent = Color3.fromRGB(0, 162, 255),
        Text = Color3.fromRGB(255, 255, 255),
        Border = Color3.fromRGB(60, 60, 60)
    },
    Light = {
        Background = Color3.fromRGB(240, 240, 240),
        Secondary = Color3.fromRGB(255, 255, 255),
        Accent = Color3.fromRGB(0, 122, 255),
        Text = Color3.fromRGB(0, 0, 0),
        Border = Color3.fromRGB(200, 200, 200)
    }
}

local currentTheme = themes.Dark

function UILibrary.ChangeTheme(themeName)
    if themes[themeName] then
        currentTheme = themes[themeName]
        -- Apply theme to all existing UI elements
        for _, window in pairs(UILibrary.windows or {}) do
            window:ApplyTheme()
        end
    end
end

-- Dragging Functionality
function UILibrary.AddDraggingFunctionality(frame)
    local dragging = false
    local dragStart = nil
    local startPos = nil
    
    frame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = true
            dragStart = input.Position
            startPos = frame.Position
        end
    end)
    
    frame.InputChanged:Connect(function(input)
        if dragging and input.UserInputType == Enum.UserInputType.MouseMovement then
            local delta = input.Position - dragStart
            frame.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, 
                                      startPos.Y.Scale, startPos.Y.Offset + delta.Y)
        end
    end)
    
    frame.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = false
        end
    end)
end

-- Drawing Functions
function UILibrary.DrawTriangle(parent, point1, point2, point3, color, thickness)
    local triangle = Instance.new("Frame")
    triangle.Name = "Triangle"
    triangle.Size = UDim2.new(0, 20, 0, 20)
    triangle.BackgroundColor3 = color or currentTheme.Accent
    triangle.BorderSizePixel = thickness or 1
    triangle.Parent = parent
    return triangle
end

function UILibrary.DrawQuad(parent, size, position, color)
    local quad = Instance.new("Frame")
    quad.Name = "Quad"
    quad.Size = size
    quad.Position = position
    quad.BackgroundColor3 = color or currentTheme.Secondary
    quad.BorderSizePixel = 1
    quad.BorderColor3 = currentTheme.Border
    quad.Parent = parent
    return quad
end

-- Frame Binding System
local binds = {}
binds.parts = {}
binds.parents = {}

function UILibrary.BindFrame(frame, part)
    local uid = UILibrary.GenUid()
    binds.parts[uid] = part
    binds.parents[uid] = frame
    
    local connection
    connection = RunService.Heartbeat:Connect(function()
        if part and part.Parent then
            UILibrary.UpdateOrientation(frame, part)
        else
            connection:Disconnect()
            binds.parts[uid] = nil
            binds.parents[uid] = nil
        end
    end)
    
    return {
        add = function(newPart)
            binds.parts[uid] = newPart
        end
    }
end

function UILibrary.UpdateOrientation(frame, part)
    if part and part.Parent then
        local camera = workspace.CurrentCamera
        local vector, onScreen = camera:WorldToViewportPoint(part.Position)
        
        if onScreen then
            frame.Position = UDim2.new(0, vector.X, 0, vector.Y)
            frame.Visible = true
        else
            frame.Visible = false
        end
    end
end

function UILibrary.UnbindFrame(uid)
    if binds.parts[uid] then
        binds.parts[uid] = nil
        binds.parents[uid] = nil
    end
end

function UILibrary.HasBinding(uid)
    return binds.parts[uid] ~= nil
end

function UILibrary.GetBoundParts()
    return binds.parts
end

-- Utility Functions
function UILibrary.Modify(instance, properties)
    for property, value in pairs(properties) do
        instance[property] = value
    end
    return instance
end

function UILibrary.Notify(title, text, duration)
    -- Create notification system
    local notification = Instance.new("Frame")
    notification.Name = "Notification"
    notification.Size = UDim2.new(0, 300, 0, 80)
    notification.Position = UDim2.new(1, -320, 0, 20)
    notification.BackgroundColor3 = currentTheme.Secondary
    notification.BorderSizePixel = 1
    notification.BorderColor3 = currentTheme.Border
    notification.Parent = playerGui
    
    local titleLabel = Instance.new("TextLabel")
    titleLabel.Name = "Title"
    titleLabel.Size = UDim2.new(1, 0, 0.5, 0)
    titleLabel.BackgroundTransparency = 1
    titleLabel.Text = title
    titleLabel.TextColor3 = currentTheme.Text
    titleLabel.TextScaled = true
    titleLabel.Font = Enum.Font.SourceSansBold
    titleLabel.Parent = notification
    
    local textLabel = Instance.new("TextLabel")
    textLabel.Name = "Text"
    textLabel.Size = UDim2.new(1, 0, 0.5, 0)
    textLabel.Position = UDim2.new(0, 0, 0.5, 0)
    textLabel.BackgroundTransparency = 1
    textLabel.Text = text
    textLabel.TextColor3 = currentTheme.Text
    textLabel.TextScaled = true
    textLabel.Font = Enum.Font.SourceSans
    textLabel.Parent = notification
    
    -- Animate in
    notification:TweenPosition(UDim2.new(1, -320, 0, 20), "Out", "Quad", 0.3)
    
    -- Auto-dismiss
    wait(duration or 3)
    notification:TweenPosition(UDim2.new(1, 0, 0, 20), "Out", "Quad", 0.3)
    wait(0.3)
    notification:Destroy()
end

-- Window Management
UILibrary.windows = {}

function UILibrary.Hide()
    for _, window in pairs(UILibrary.windows) do
        window.frame.Visible = false
    end
end

function UILibrary.Unhide()
    for _, window in pairs(UILibrary.windows) do
        window.frame.Visible = true
    end
end

function UILibrary.Maximise()
    for _, window in pairs(UILibrary.windows) do
        window:Maximize()
    end
end

function UILibrary.Minimise()
    for _, window in pairs(UILibrary.windows) do
        window:Minimize()
    end
end

function UILibrary.Destroy()
    for _, window in pairs(UILibrary.windows) do
        window:Destroy()
    end
    UILibrary.windows = {}
end

-- Window Class
local Window = {}
Window.__index = Window

function UILibrary.CreateWindow(title, size)
    local self = setmetatable({}, Window)
    self.title = title or "UI Library"
    self.size = size or UDim2.new(0, 500, 0, 400)
    self.tabs = {}
    self.minimized = false
    
    -- Create main frame
    self.screenGui = Instance.new("ScreenGui")
    self.screenGui.Name = "UILibrary_" .. UILibrary.GenUid()
    self.screenGui.ResetOnSpawn = false
    self.screenGui.Parent = playerGui
    
    self.frame = Instance.new("Frame")
    self.frame.Name = "MainWindow"
    self.frame.Size = self.size
    self.frame.Position = UDim2.new(0.5, -self.size.X.Offset/2, 0.5, -self.size.Y.Offset/2)
    self.frame.BackgroundColor3 = currentTheme.Background
    self.frame.BorderSizePixel = 1
    self.frame.BorderColor3 = currentTheme.Border
    self.frame.Parent = self.screenGui
    
    -- Title bar
    self.titleBar = Instance.new("Frame")
    self.titleBar.Name = "TitleBar"
    self.titleBar.Size = UDim2.new(1, 0, 0, 30)
    self.titleBar.BackgroundColor3 = currentTheme.Accent
    self.titleBar.BorderSizePixel = 0
    self.titleBar.Parent = self.frame
    
    self.titleLabel = Instance.new("TextLabel")
    self.titleLabel.Name = "Title"
    self.titleLabel.Size = UDim2.new(1, -60, 1, 0)
    self.titleLabel.BackgroundTransparency = 1
    self.titleLabel.Text = self.title
    self.titleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    self.titleLabel.TextScaled = true
    self.titleLabel.Font = Enum.Font.SourceSansBold
    self.titleLabel.Parent = self.titleBar
    
    -- Minimize button
    self.minimizeBtn = Instance.new("TextButton")
    self.minimizeBtn.Name = "MinimizeButton"
    self.minimizeBtn.Size = UDim2.new(0, 30, 1, 0)
    self.minimizeBtn.Position = UDim2.new(1, -60, 0, 0)
    self.minimizeBtn.BackgroundTransparency = 1
    self.minimizeBtn.Text = "-"
    self.minimizeBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
    self.minimizeBtn.TextScaled = true
    self.minimizeBtn.Font = Enum.Font.SourceSansBold
    self.minimizeBtn.Parent = self.titleBar
    
    -- Close button
    self.closeBtn = Instance.new("TextButton")
    self.closeBtn.Name = "CloseButton"
    self.closeBtn.Size = UDim2.new(0, 30, 1, 0)
    self.closeBtn.Position = UDim2.new(1, -30, 0, 0)
    self.closeBtn.BackgroundTransparency = 1
    self.closeBtn.Text = "X"
    self.closeBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
    self.closeBtn.TextScaled = true
    self.closeBtn.Font = Enum.Font.SourceSansBold
    self.closeBtn.Parent = self.titleBar
    
    -- Tab container
    self.tabContainer = Instance.new("Frame")
    self.tabContainer.Name = "TabContainer"
    self.tabContainer.Size = UDim2.new(1, 0, 0, 30)
    self.tabContainer.Position = UDim2.new(0, 0, 0, 30)
    self.tabContainer.BackgroundColor3 = currentTheme.Secondary
    self.tabContainer.BorderSizePixel = 0
    self.tabContainer.Parent = self.frame
    
    -- Content container
    self.contentContainer = Instance.new("Frame")
    self.contentContainer.Name = "ContentContainer"
    self.contentContainer.Size = UDim2.new(1, 0, 1, -60)
    self.contentContainer.Position = UDim2.new(0, 0, 0, 60)
    self.contentContainer.BackgroundTransparency = 1
    self.contentContainer.Parent = self.frame
    
    -- Add dragging
    UILibrary.AddDraggingFunctionality(self.titleBar)
    
    -- Button connections
    self.minimizeBtn.MouseButton1Click:Connect(function()
        self:Minimize()
    end)
    
    self.closeBtn.MouseButton1Click:Connect(function()
        self:Destroy()
    end)
    
    -- Add to windows list
    table.insert(UILibrary.windows, self)
    
    return self
end

function Window:ApplyTheme()
    self.frame.BackgroundColor3 = currentTheme.Background
    self.frame.BorderColor3 = currentTheme.Border
    self.titleBar.BackgroundColor3 = currentTheme.Accent
    self.tabContainer.BackgroundColor3 = currentTheme.Secondary
end

function Window:Minimize()
    self.minimized = not self.minimized
    local targetSize = self.minimized and UDim2.new(self.size.X.Scale, self.size.X.Offset, 0, 30) or self.size
    
    TweenService:Create(self.frame, TweenInfo.new(0.3), {Size = targetSize}):Play()
    self.minimizeBtn.Text = self.minimized and "+" or "-"
end

function Window:Maximize()
    self.minimized = false
    self.frame.Size = self.size
    self.minimizeBtn.Text = "-"
end

function Window:Destroy()
    self.screenGui:Destroy()
    for i, window in pairs(UILibrary.windows) do
        if window == self then
            table.remove(UILibrary.windows, i)
            break
        end
    end
end

-- Tab Class
local Tab = {}
Tab.__index = Tab

function Window:CreateTab(name)
    local self = setmetatable({}, Tab)
    self.name = name
    self.window = self
    self.elements = {}
    self.active = #self.tabs == 0
    
    -- Tab button
    self.tabButton = Instance.new("TextButton")
    self.tabButton.Name = name .. "Tab"
    self.tabButton.Size = UDim2.new(0, 100, 1, 0)
    self.tabButton.Position = UDim2.new(0, #self.tabs * 100, 0, 0)
    self.tabButton.BackgroundColor3 = self.active and currentTheme.Accent or currentTheme.Secondary
    self.tabButton.BorderSizePixel = 1
    self.tabButton.BorderColor3 = currentTheme.Border
    self.tabButton.Text = name
    self.tabButton.TextColor3 = currentTheme.Text
    self.tabButton.TextScaled = true
    self.tabButton.Font = Enum.Font.SourceSans
    self.tabButton.Parent = self.tabContainer
    
    -- Tab content
    self.content = Instance.new("ScrollingFrame")
    self.content.Name = name .. "Content"
    self.content.Size = UDim2.new(1, 0, 1, 0)
    self.content.BackgroundTransparency = 1
    self.content.BorderSizePixel = 0
    self.content.ScrollBarThickness = 6
    self.content.ScrollBarImageColor3 = currentTheme.Accent
    self.content.Visible = self.active
    self.content.Parent = self.contentContainer
    
    -- Layout
    local layout = Instance.new("UIListLayout")
    layout.SortOrder = Enum.SortOrder.LayoutOrder
    layout.Padding = UDim.new(0, 5)
    layout.Parent = self.content
    
    -- Tab switching
    self.tabButton.MouseButton1Click:Connect(function()
        for _, tab in pairs(self.tabs) do
            tab.content.Visible = false
            tab.tabButton.BackgroundColor3 = currentTheme.Secondary
        end
        self.content.Visible = true
        self.tabButton.BackgroundColor3 = currentTheme.Accent
    end)
    
    table.insert(self.tabs, self)
    return self
end

-- Button Element
local ButtonValue = {}
ButtonValue.__index = ButtonValue

function ButtonValue:Set(callback)
    self.callback = callback
end

function Tab:CreateButton(text, callback)
    local buttonValue = setmetatable({}, ButtonValue)
    buttonValue.callback = callback
    
    local button = Instance.new("TextButton")
    button.Name = "Button"
    button.Size = UDim2.new(1, -10, 0, 30)
    button.BackgroundColor3 = currentTheme.Secondary
    button.BorderSizePixel = 1
    button.BorderColor3 = currentTheme.Border
    button.Text = text
    button.TextColor3 = currentTheme.Text
    button.TextScaled = true
    button.Font = Enum.Font.SourceSans
    button.Parent = self.content
    
    button.MouseButton1Click:Connect(function()
        if buttonValue.callback then
            buttonValue.callback()
        end
    end)
    
    return buttonValue
end

-- Toggle Element
local ToggleValue = {}
ToggleValue.__index = ToggleValue

function ToggleValue:Set(value)
    self.value = value
    self.toggle.BackgroundColor3 = value and currentTheme.Accent or currentTheme.Secondary
    if self.callback then
        self.callback(value)
    end
end

function Tab:CreateToggle(text, default, callback)
    local toggleValue = setmetatable({}, ToggleValue)
    toggleValue.value = default or false
    toggleValue.callback = callback
    
    local container = Instance.new("Frame")
    container.Name = "ToggleContainer"
    container.Size = UDim2.new(1, -10, 0, 30)
    container.BackgroundTransparency = 1
    container.Parent = self.content
    
    local label = Instance.new("TextLabel")
    label.Name = "Label"
    label.Size = UDim2.new(1, -40, 1, 0)
    label.BackgroundTransparency = 1
    label.Text = text
    label.TextColor3 = currentTheme.Text
    label.TextScaled = true
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.Font = Enum.Font.SourceSans
    label.Parent = container
    
    local toggle = Instance.new("TextButton")
    toggle.Name = "Toggle"
    toggle.Size = UDim2.new(0, 30, 0, 20)
    toggle.Position = UDim2.new(1, -35, 0.5, -10)
    toggle.BackgroundColor3 = toggleValue.value and currentTheme.Accent or currentTheme.Secondary
    toggle.BorderSizePixel = 1
    toggle.BorderColor3 = currentTheme.Border
    toggle.Text = ""
    toggle.Parent = container
    
    toggleValue.toggle = toggle
    
    toggle.MouseButton1Click:Connect(function()
        toggleValue:Set(not toggleValue.value)
    end)
    
    return toggleValue
end

-- Additional element creation methods would follow similar patterns:
-- CreateSlider, CreateDropdown, CreateInput, CreateColorPicker, etc.
-- Each would return their respective value objects with Set methods

-- Section Element
local SectionValue = {}
SectionValue.__index = SectionValue

function SectionValue:Set(text)
    self.label.Text = text
end

function Tab:CreateSection(text)
    local sectionValue = setmetatable({}, SectionValue)
    
    local section = Instance.new("Frame")
    section.Name = "Section"
    section.Size = UDim2.new(1, -10, 0, 30)
    section.BackgroundColor3 = currentTheme.Accent
    section.BorderSizePixel = 1
    section.BorderColor3 = currentTheme.Border
    section.Parent = self.content
    
    local label = Instance.new("TextLabel")
    label.Name = "SectionLabel"
    label.Size = UDim2.new(1, 0, 1, 0)
    label.BackgroundTransparency = 1
    label.Text = text
    label.TextColor3 = Color3.fromRGB(255, 255, 255)
    label.TextScaled = true
    label.Font = Enum.Font.SourceSansBold
    label.Parent = section
    
    sectionValue.label = label
    return sectionValue
end

-- Label Element
local LabelValue = {}
LabelValue.__index = LabelValue

function LabelValue:Set(text)
    self.label.Text = text
end

function Tab:CreateLabel(text)
    local labelValue = setmetatable({}, LabelValue)
    
    local label = Instance.new("TextLabel")
    label.Name = "Label"
    label.Size = UDim2.new(1, -10, 0, 25)
    label.BackgroundTransparency = 1
    label.Text = text
    label.TextColor3 = currentTheme.Text
    label.TextScaled = true
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.Font = Enum.Font.SourceSans
    label.Parent = self.content
    
    labelValue.label = label
    return labelValue
end

-- Paragraph Element
local ParagraphValue = {}
ParagraphValue.__index = ParagraphValue

function ParagraphValue:Set(text)
    self.label.Text = text
end

function Tab:CreateParagraph(text)
    local paragraphValue = setmetatable({}, ParagraphValue)
    
    local label = Instance.new("TextLabel")
    label.Name = "Paragraph"
    label.Size = UDim2.new(1, -10, 0, 60)
    label.BackgroundTransparency = 1
    label.Text = text
    label.TextColor3 = currentTheme.Text
    label.TextScaled = true
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.TextYAlignment = Enum.TextYAlignment.Top
    label.TextWrapped = true
    label.Font = Enum.Font.SourceSans
    label.Parent = self.content
    
    paragraphValue.label = label
    return paragraphValue
end

-- Input Element
local InputSettings = {}
InputSettings.__index = InputSettings

function InputSettings:Set(placeholder)
    self.textBox.PlaceholderText = placeholder
end

function Tab:CreateInput(placeholder, callback)
    local inputSettings = setmetatable({}, InputSettings)
    inputSettings.callback = callback
    
    local textBox = Instance.new("TextBox")
    textBox.Name = "Input"
    textBox.Size = UDim2.new(1, -10, 0, 30)
    textBox.BackgroundColor3 = currentTheme.Secondary
    textBox.BorderSizePixel = 1
    textBox.BorderColor3 = currentTheme.Border
    textBox.PlaceholderText = placeholder
    textBox.PlaceholderColor3 = Color3.fromRGB(150, 150, 150)
    textBox.Text = ""
    textBox.TextColor3 = currentTheme.Text
    textBox.TextScaled = true
    textBox.Font = Enum.Font.SourceSans
    textBox.Parent = self.content
    
    inputSettings.textBox = textBox
    
    textBox.FocusLost:Connect(function(enterPressed)
        if enterPressed and inputSettings.callback then
            inputSettings.callback(textBox.Text)
        end
    end)
    
    return inputSettings
end

-- Dropdown, Keybind, Slider, and ColorPicker would follow similar patterns
-- This provides the core structure for the UI library

return UILibrary
