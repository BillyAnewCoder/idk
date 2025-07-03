-- Enhanced OwlHub-Style GUI System with Advanced Animations
-- Place this in StarterPlayer > StarterPlayerScripts or auto-execute

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local TeleportService = game:GetService("TeleportService")
local HttpService = game:GetService("HttpService")

local Player = Players.LocalPlayer
local PlayerGui = Player:WaitForChild("PlayerGui")

-- Advanced Animation System
local AnimationSystem = {}

function AnimationSystem:CreateGlow(object, glowColor, intensity)
    local glow = Instance.new("ImageLabel")
    glow.Name = "Glow"
    glow.BackgroundTransparency = 1
    glow.Image = "rbxasset://textures/ui/Glow.png"
    glow.ImageColor3 = glowColor or Color3.fromRGB(65, 105, 225)
    glow.ImageTransparency = 0.5
    glow.Size = UDim2.new(1, intensity or 20, 1, intensity or 20)
    glow.Position = UDim2.new(0, -(intensity or 10), 0, -(intensity or 10))
    glow.ZIndex = object.ZIndex - 1
    glow.Parent = object.Parent
    return glow
end

function AnimationSystem:CreateRipple(button, rippleColor)
    local ripple = Instance.new("Frame")
    ripple.Name = "Ripple"
    ripple.BackgroundColor3 = rippleColor or Color3.fromRGB(255, 255, 255)
    ripple.BackgroundTransparency = 0.8
    ripple.BorderSizePixel = 0
    ripple.Size = UDim2.new(0, 0, 0, 0)
    ripple.Position = UDim2.new(0.5, 0, 0.5, 0)
    ripple.AnchorPoint = Vector2.new(0.5, 0.5)
    ripple.ZIndex = button.ZIndex + 1
    ripple.Parent = button
    
    local rippleCorner = Instance.new("UICorner")
    rippleCorner.CornerRadius = UDim.new(1, 0)
    rippleCorner.Parent = ripple
    
    local expandTween = TweenService:Create(ripple, TweenInfo.new(0.6, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {
        Size = UDim2.new(0, math.max(button.AbsoluteSize.X, button.AbsoluteSize.Y) * 2, 0, math.max(button.AbsoluteSize.X, button.AbsoluteSize.Y) * 2),
        BackgroundTransparency = 1
    })
    
    expandTween:Play()
    expandTween.Completed:Connect(function()
        ripple:Destroy()
    end)
end

function AnimationSystem:CreatePulse(object, pulseColor)
    local pulse = object:Clone()
    pulse.Name = "Pulse"
    pulse.BackgroundColor3 = pulseColor or Color3.fromRGB(65, 105, 225)
    pulse.BackgroundTransparency = 0.7
    pulse.ZIndex = object.ZIndex - 1
    pulse.Parent = object.Parent
    
    -- Clear all children to avoid duplication
    for _, child in pairs(pulse:GetChildren()) do
        if not child:IsA("UICorner") then
            child:Destroy()
        end
    end
    
    local pulseTween = TweenService:Create(pulse, TweenInfo.new(1, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true), {
        Size = UDim2.new(pulse.Size.X.Scale * 1.1, pulse.Size.X.Offset + 10, pulse.Size.Y.Scale * 1.1, pulse.Size.Y.Offset + 10),
        BackgroundTransparency = 1
    })
    
    pulseTween:Play()
    return pulse, pulseTween
end

function AnimationSystem:CreateFloatingEffect(object)
    local floatTween = TweenService:Create(object, TweenInfo.new(2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true), {
        Position = UDim2.new(object.Position.X.Scale, object.Position.X.Offset, object.Position.Y.Scale, object.Position.Y.Offset + 3)
    })
    floatTween:Play()
    return floatTween
end

-- Cross-Game Persistence Handler
local PersistenceHandler = {}

function PersistenceHandler:SaveToClipboard()
    local scriptContent = game:HttpGet("https://raw.githubusercontent.com/your-repo/owlhub-loader.lua")
    setclipboard(scriptContent)
    return true
end

function PersistenceHandler:HandleTeleport()
    self:SaveToClipboard()
    
    local teleportData = {
        script = "loadstring(game:HttpGet('https://raw.githubusercontent.com/your-repo/owlhub-loader.lua'))()",
        autoExecute = true
    }
    
    TeleportService.TeleportInitFailed:Connect(function()
        warn("Teleport failed - Script saved to clipboard")
    end)
    
    return teleportData
end

-- Enhanced GUI Library
local Library = {}
Library.__index = Library

-- Enhanced Themes with gradients and effects
local Themes = {
    Dark = {
        Background = Color3.fromRGB(15, 15, 20),
        Secondary = Color3.fromRGB(25, 25, 35),
        Accent = Color3.fromRGB(65, 105, 225),
        AccentHover = Color3.fromRGB(85, 125, 245),
        Text = Color3.fromRGB(255, 255, 255),
        SubText = Color3.fromRGB(170, 170, 170),
        Border = Color3.fromRGB(45, 45, 55),
        Success = Color3.fromRGB(46, 204, 113),
        Warning = Color3.fromRGB(241, 196, 15),
        Error = Color3.fromRGB(231, 76, 60),
        Glass = Color3.fromRGB(255, 255, 255)
    }
}

-- Create main GUI with enhanced effects
function Library:CreateWindow(title, theme)
    theme = theme or "Dark"
    local currentTheme = Themes[theme]
    
    -- Destroy existing GUI
    if PlayerGui:FindFirstChild("OwlHubGUI") then
        PlayerGui:FindFirstChild("OwlHubGUI"):Destroy()
    end
    
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "OwlHubGUI"
    ScreenGui.ResetOnSpawn = false
    ScreenGui.Parent = PlayerGui
    
    -- Main Frame with enhanced styling
    local MainFrame = Instance.new("Frame")
    MainFrame.Name = "MainFrame"
    MainFrame.Size = UDim2.new(0, 420, 0, 300)
    MainFrame.Position = UDim2.new(0.5, -210, 0.5, -150)
    MainFrame.BackgroundColor3 = currentTheme.Background
    MainFrame.BorderSizePixel = 0
    MainFrame.Active = true
    MainFrame.Draggable = true
    MainFrame.ClipsDescendants = true
    MainFrame.Parent = ScreenGui
    
    -- Enhanced corner rounding
    local MainCorner = Instance.new("UICorner")
    MainCorner.CornerRadius = UDim.new(0, 12)
    MainCorner.Parent = MainFrame
    
    -- Glass morphism effect
    local GlassEffect = Instance.new("Frame")
    GlassEffect.Name = "GlassEffect"
    GlassEffect.Size = UDim2.new(1, 0, 1, 0)
    GlassEffect.BackgroundColor3 = currentTheme.Glass
    GlassEffect.BackgroundTransparency = 0.95
    GlassEffect.BorderSizePixel = 0
    GlassEffect.ZIndex = MainFrame.ZIndex + 1
    GlassEffect.Parent = MainFrame
    
    local GlassCorner = Instance.new("UICorner")
    GlassCorner.CornerRadius = UDim.new(0, 12)
    GlassCorner.Parent = GlassEffect
    
    -- Animated border glow
    local BorderGlow = AnimationSystem:CreateGlow(MainFrame, currentTheme.Accent, 30)
    BorderGlow.ImageTransparency = 0.8
    
    -- Pulsing border effect
    local borderPulse = TweenService:Create(BorderGlow, TweenInfo.new(2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true), {
        ImageTransparency = 0.6
    })
    borderPulse:Play()
    
    -- Entrance animation
    MainFrame.Size = UDim2.new(0, 0, 0, 0)
    MainFrame.Position = UDim2.new(0.5, 0, 0.5, 0)
    
    local entranceTween = TweenService:Create(MainFrame, TweenInfo.new(0.5, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
        Size = UDim2.new(0, 420, 0, 300),
        Position = UDim2.new(0.5, -210, 0.5, -150)
    })
    entranceTween:Play()
    
    -- Enhanced Title Bar
    local TitleBar = Instance.new("Frame")
    TitleBar.Name = "TitleBar"
    TitleBar.Size = UDim2.new(1, 0, 0, 35)
    TitleBar.BackgroundColor3 = currentTheme.Secondary
    TitleBar.BorderSizePixel = 0
    TitleBar.ZIndex = GlassEffect.ZIndex + 1
    TitleBar.Parent = MainFrame
    
    local TitleCorner = Instance.new("UICorner")
    TitleCorner.CornerRadius = UDim.new(0, 12)
    TitleCorner.Parent = TitleBar
    
    -- Gradient overlay for title bar
    local TitleGradient = Instance.new("UIGradient")
    TitleGradient.Color = ColorSequence.new({
        ColorSequenceKeypoint.new(0, currentTheme.Secondary),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(currentTheme.Secondary.R * 255 + 10, currentTheme.Secondary.G * 255 + 10, currentTheme.Secondary.B * 255 + 10))
    })
    TitleGradient.Rotation = 45
    TitleGradient.Parent = TitleBar
    
    -- Fix bottom corners
    local TitleFix = Instance.new("Frame")
    TitleFix.Size = UDim2.new(1, 0, 0.5, 0)
    TitleFix.Position = UDim2.new(0, 0, 0.5, 0)
    TitleFix.BackgroundColor3 = currentTheme.Secondary
    TitleFix.BorderSizePixel = 0
    TitleFix.ZIndex = TitleBar.ZIndex
    TitleFix.Parent = TitleBar
    
    -- Enhanced Title Text with shadow
    local TitleShadow = Instance.new("TextLabel")
    TitleShadow.Name = "TitleShadow"
    TitleShadow.Size = UDim2.new(1, -60, 1, 0)
    TitleShadow.Position = UDim2.new(0, 12, 0, 2)
    TitleShadow.BackgroundTransparency = 1
    TitleShadow.Text = title or "OwlHub"
    TitleShadow.TextColor3 = Color3.fromRGB(0, 0, 0)
    TitleShadow.TextSize = 15
    TitleShadow.TextXAlignment = Enum.TextXAlignment.Left
    TitleShadow.Font = Enum.Font.GothamBold
    TitleShadow.TextTransparency = 0.5
    TitleShadow.ZIndex = TitleBar.ZIndex + 1
    TitleShadow.Parent = TitleBar
    
    local TitleText = Instance.new("TextLabel")
    TitleText.Name = "TitleText"
    TitleText.Size = UDim2.new(1, -60, 1, 0)
    TitleText.Position = UDim2.new(0, 10, 0, 0)
    TitleText.BackgroundTransparency = 1
    TitleText.Text = title or "OwlHub"
    TitleText.TextColor3 = currentTheme.Text
    TitleText.TextSize = 15
    TitleText.TextXAlignment = Enum.TextXAlignment.Left
    TitleText.Font = Enum.Font.GothamBold
    TitleText.ZIndex = TitleShadow.ZIndex + 1
    TitleText.Parent = TitleBar
    
    -- Animated title glow
    local titleGlow = TweenService:Create(TitleText, TweenInfo.new(3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true), {
        TextColor3 = currentTheme.AccentHover
    })
    titleGlow:Play()
    
    -- Enhanced Close Button
    local CloseButton = Instance.new("TextButton")
    CloseButton.Name = "CloseButton"
    CloseButton.Size = UDim2.new(0, 28, 0, 22)
    CloseButton.Position = UDim2.new(1, -35, 0, 6)
    CloseButton.BackgroundColor3 = currentTheme.Error
    CloseButton.Text = "×"
    CloseButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    CloseButton.TextSize = 16
    CloseButton.Font = Enum.Font.GothamBold
    CloseButton.BorderSizePixel = 0
    CloseButton.ZIndex = TitleBar.ZIndex + 2
    CloseButton.Parent = TitleBar
    
    local CloseCorner = Instance.new("UICorner")
    CloseCorner.CornerRadius = UDim.new(0, 6)
    CloseCorner.Parent = CloseButton
    
    -- Enhanced Minimize Button
    local MinimizeButton = Instance.new("TextButton")
    MinimizeButton.Name = "MinimizeButton"
    MinimizeButton.Size = UDim2.new(0, 28, 0, 22)
    MinimizeButton.Position = UDim2.new(1, -68, 0, 6)
    MinimizeButton.BackgroundColor3 = currentTheme.Warning
    MinimizeButton.Text = "─"
    MinimizeButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    MinimizeButton.TextSize = 14
    MinimizeButton.Font = Enum.Font.GothamBold
    MinimizeButton.BorderSizePixel = 0
    MinimizeButton.ZIndex = TitleBar.ZIndex + 2
    MinimizeButton.Parent = TitleBar
    
    local MinCorner = Instance.new("UICorner")
    MinCorner.CornerRadius = UDim.new(0, 6)
    MinCorner.Parent = MinimizeButton
    
    -- Enhanced Tab Container
    local TabContainer = Instance.new("Frame")
    TabContainer.Name = "TabContainer"
    TabContainer.Size = UDim2.new(0, 100, 1, -35)
    TabContainer.Position = UDim2.new(0, 0, 0, 35)
    TabContainer.BackgroundColor3 = currentTheme.Secondary
    TabContainer.BorderSizePixel = 0
    TabContainer.ZIndex = GlassEffect.ZIndex + 1
    TabContainer.Parent = MainFrame
    
    -- Tab container gradient
    local TabGradient = Instance.new("UIGradient")
    TabGradient.Color = ColorSequence.new({
        ColorSequenceKeypoint.new(0, currentTheme.Secondary),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(currentTheme.Secondary.R * 255 - 5, currentTheme.Secondary.G * 255 - 5, currentTheme.Secondary.B * 255 - 5))
    })
    TabGradient.Rotation = 90
    TabGradient.Parent = TabContainer
    
    -- Enhanced Content Container
    local ContentContainer = Instance.new("Frame")
    ContentContainer.Name = "ContentContainer"
    ContentContainer.Size = UDim2.new(1, -100, 1, -35)
    ContentContainer.Position = UDim2.new(0, 100, 0, 35)
    ContentContainer.BackgroundColor3 = currentTheme.Background
    ContentContainer.BorderSizePixel = 0
    ContentContainer.ClipsDescendants = true
    ContentContainer.ZIndex = GlassEffect.ZIndex + 1
    ContentContainer.Parent = MainFrame
    
    -- Tab List with enhanced styling
    local TabList = Instance.new("ScrollingFrame")
    TabList.Name = "TabList"
    TabList.Size = UDim2.new(1, 0, 1, 0)
    TabList.BackgroundTransparency = 1
    TabList.BorderSizePixel = 0
    TabList.ScrollBarThickness = 3
    TabList.ScrollBarImageColor3 = currentTheme.Accent
    TabList.ZIndex = TabContainer.ZIndex + 1
    TabList.Parent = TabContainer
    
    local TabListLayout = Instance.new("UIListLayout")
    TabListLayout.SortOrder = Enum.SortOrder.LayoutOrder
    TabListLayout.FillDirection = Enum.FillDirection.Vertical
    TabListLayout.Padding = UDim.new(0, 2)
    TabListLayout.Parent = TabList
    
    local TabListPadding = Instance.new("UIPadding")
    TabListPadding.PaddingTop = UDim.new(0, 8)
    TabListPadding.PaddingLeft = UDim.new(0, 6)
    TabListPadding.PaddingRight = UDim.new(0, 6)
    TabListPadding.Parent = TabList
    
    -- Window object
    local Window = {
        ScreenGui = ScreenGui,
        MainFrame = MainFrame,
        TabContainer = TabContainer,
        ContentContainer = ContentContainer,
        TabList = TabList,
        Theme = currentTheme,
        Tabs = {},
        CurrentTab = nil,
        Minimized = false,
        PersistenceHandler = PersistenceHandler,
        AnimationSystem = AnimationSystem
    }
    
    -- Enhanced button animations
    local function enhancedButtonAnimation(button, hoverColor, clickColor, useRipple)
        local originalColor = button.BackgroundColor3
        local glow = AnimationSystem:CreateGlow(button, hoverColor, 15)
        glow.ImageTransparency = 1
        
        button.MouseEnter:Connect(function()
            -- Glow effect
            TweenService:Create(glow, TweenInfo.new(0.2), {ImageTransparency = 0.7}):Play()
            -- Color change
            TweenService:Create(button, TweenInfo.new(0.2, Enum.EasingStyle.Quart), {
                BackgroundColor3 = hoverColor,
                Size = UDim2.new(button.Size.X.Scale, button.Size.X.Offset + 2, button.Size.Y.Scale, button.Size.Y.Offset + 1)
            }):Play()
        end)
        
        button.MouseLeave:Connect(function()
            TweenService:Create(glow, TweenInfo.new(0.2), {ImageTransparency = 1}):Play()
            TweenService:Create(button, TweenInfo.new(0.2, Enum.EasingStyle.Quart), {
                BackgroundColor3 = originalColor,
                Size = UDim2.new(button.Size.X.Scale, button.Size.X.Offset - 2, button.Size.Y.Scale, button.Size.Y.Offset - 1)
            }):Play()
        end)
        
        button.MouseButton1Down:Connect(function()
            TweenService:Create(button, TweenInfo.new(0.1), {
                BackgroundColor3 = clickColor,
                Size = UDim2.new(button.Size.X.Scale, button.Size.X.Offset - 1, button.Size.Y.Scale, button.Size.Y.Offset - 1)
            }):Play()
            
            if useRipple then
                AnimationSystem:CreateRipple(button, Color3.fromRGB(255, 255, 255))
            end
        end)
        
        button.MouseButton1Up:Connect(function()
            TweenService:Create(button, TweenInfo.new(0.1), {
                BackgroundColor3 = hoverColor,
                Size = UDim2.new(button.Size.X.Scale, button.Size.X.Offset + 1, button.Size.Y.Scale, button.Size.Y.Offset + 1)
            }):Play()
        end)
    end
    
    -- Close functionality with animation
    CloseButton.MouseButton1Click:Connect(function()
        local exitTween = TweenService:Create(MainFrame, TweenInfo.new(0.3, Enum.EasingStyle.Back, Enum.EasingDirection.In), {
            Size = UDim2.new(0, 0, 0, 0),
            Position = UDim2.new(0.5, 0, 0.5, 0)
        })
        exitTween:Play()
        exitTween.Completed:Connect(function()
            ScreenGui:Destroy()
        end)
    end)
    
    -- Minimize functionality with enhanced animation
    MinimizeButton.MouseButton1Click:Connect(function()
        Window.Minimized = not Window.Minimized
        local targetSize = Window.Minimized and UDim2.new(0, 420, 0, 35) or UDim2.new(0, 420, 0, 300)
        
        TweenService:Create(MainFrame, TweenInfo.new(0.4, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {Size = targetSize}):Play()
        
        -- Animate minimize button text
        MinimizeButton.Text = Window.Minimized and "+" or "─"
    end)
    
    enhancedButtonAnimation(CloseButton, Color3.fromRGB(250, 80, 80), Color3.fromRGB(200, 60, 60), true)
    enhancedButtonAnimation(MinimizeButton, Color3.fromRGB(255, 210, 30), Color3.fromRGB(220, 180, 20), true)
    
    -- Tab creation function with enhanced animations
    function Window:CreateTab(name, icon)
        local Tab = {
            Name = name,
            Icon = icon,
            Content = nil,
            Button = nil,
            Elements = {},
            LoadOrder = #self.Tabs + 1
        }
        
        -- Enhanced Tab Button
        local TabButton = Instance.new("TextButton")
        TabButton.Name = name .. "Tab"
        TabButton.Size = UDim2.new(1, -6, 0, 32)
        TabButton.BackgroundColor3 = self.Theme.Background
        TabButton.BorderSizePixel = 0
        TabButton.Text = ""
        TabButton.ZIndex = self.TabList.ZIndex + 1
        TabButton.Parent = self.TabList
        
        local TabCorner = Instance.new("UICorner")
        TabCorner.CornerRadius = UDim.new(0, 8)
        TabCorner.Parent = TabButton
        
        -- Slide-in animation for tab buttons
        TabButton.Position = UDim2.new(-1, 0, 0, 0)
        wait(Tab.LoadOrder * 0.1)
        TweenService:Create(TabButton, TweenInfo.new(0.5, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
            Position = UDim2.new(0, 0, 0, 0)
        }):Play()
        
        -- Enhanced Tab Content
        local TabContent = Instance.new("ScrollingFrame")
        TabContent.Name = name .. "Content"
        TabContent.Size = UDim2.new(1, 0, 1, 0)
        TabContent.BackgroundTransparency = 1
        TabContent.BorderSizePixel = 0
        TabContent.ScrollBarThickness = 6
        TabContent.ScrollBarImageColor3 = self.Theme.Accent
        TabContent.Visible = false
        TabContent.ZIndex = self.ContentContainer.ZIndex + 1
        TabContent.Parent = self.ContentContainer
        
        local ContentLayout = Instance.new("UIListLayout")
        ContentLayout.SortOrder = Enum.SortOrder.LayoutOrder
        ContentLayout.FillDirection = Enum.FillDirection.Vertical
        ContentLayout.Padding = UDim.new(0, 6)
        ContentLayout.Parent = TabContent
        
        local ContentPadding = Instance.new("UIPadding")
        ContentPadding.PaddingTop = UDim.new(0, 12)
        ContentPadding.PaddingBottom = UDim.new(0, 12)
        ContentPadding.PaddingLeft = UDim.new(0, 12)
        ContentPadding.PaddingRight = UDim.new(0, 12)
        ContentPadding.Parent = TabContent
        
        -- Enhanced Tab Label with icon
        local TabIcon = Instance.new("TextLabel")
        TabIcon.Size = UDim2.new(0, 20, 1, 0)
        TabIcon.Position = UDim2.new(0, 8, 0, 0)
        TabIcon.BackgroundTransparency = 1
        TabIcon.Text = icon or "📁"
        TabIcon.TextColor3 = self.Theme.SubText
        TabIcon.TextSize = 14
        TabIcon.TextXAlignment = Enum.TextXAlignment.Center
        TabIcon.Font = Enum.Font.Gotham
        TabIcon.ZIndex = TabButton.ZIndex + 1
        TabIcon.Parent = TabButton
        
        local TabLabel = Instance.new("TextLabel")
        TabLabel.Size = UDim2.new(1, -30, 1, 0)
        TabLabel.Position = UDim2.new(0, 30, 0, 0)
        TabLabel.BackgroundTransparency = 1
        TabLabel.Text = name
        TabLabel.TextColor3 = self.Theme.SubText
        TabLabel.TextSize = 11
        TabLabel.TextXAlignment = Enum.TextXAlignment.Left
        TabLabel.Font = Enum.Font.GothamSemibold
        TabLabel.ZIndex = TabButton.ZIndex + 1
        TabLabel.Parent = TabButton
        
        Tab.Button = TabButton
        Tab.Content = TabContent
        Tab.Label = TabLabel
        Tab.Icon = TabIcon
        
        -- Enhanced tab switching with smooth animations
        TabButton.MouseButton1Click:Connect(function()
            self:SwitchToTab(Tab)
        end)
        
        -- Enhanced tab button animations
        enhancedButtonAnimation(TabButton, self.Theme.Border, self.Theme.Accent, true)
        
        table.insert(self.Tabs, Tab)
        
        -- Auto-select first tab
        if #self.Tabs == 1 then
            wait(0.5) -- Wait for entrance animation
            self:SwitchToTab(Tab)
        end
        
        -- Enhanced element creation functions
        function Tab:CreateSection(name)
            local SectionFrame = Instance.new("Frame")
            SectionFrame.Name = name .. "Section"
            SectionFrame.Size = UDim2.new(1, 0, 0, 25)
            SectionFrame.BackgroundTransparency = 1
            SectionFrame.Parent = TabContent
            
            local SectionLine = Instance.new("Frame")
            SectionLine.Size = UDim2.new(0, 3, 1, -4)
            SectionLine.Position = UDim2.new(0, 0, 0, 2)
            SectionLine.BackgroundColor3 = Window.Theme.Accent
            SectionLine.BorderSizePixel = 0
            SectionLine.Parent = SectionFrame
            
            local LineCorner = Instance.new("UICorner")
            LineCorner.CornerRadius = UDim.new(1, 0)
            LineCorner.Parent = SectionLine
            
            local SectionLabel = Instance.new("TextLabel")
            SectionLabel.Size = UDim2.new(1, -10, 1, 0)
            SectionLabel.Position = UDim2.new(0, 10, 0, 0)
            SectionLabel.BackgroundTransparency = 1
            SectionLabel.Text = name
            SectionLabel.TextColor3 = Window.Theme.Text
            SectionLabel.TextSize = 13
            SectionLabel.TextXAlignment = Enum.TextXAlignment.Left
            SectionLabel.Font = Enum.Font.GothamBold
            SectionLabel.Parent = SectionFrame
            
            -- Animate section appearance
            SectionFrame.Size = UDim2.new(0, 0, 0, 25)
            TweenService:Create(SectionFrame, TweenInfo.new(0.3, Enum.EasingStyle.Quart), {
                Size = UDim2.new(1, 0, 0, 25)
            }):Play()
            
            return SectionFrame
        end
        
        function Tab:CreateButton(name, callback)
            local ButtonFrame = Instance.new("Frame")
            ButtonFrame.Size = UDim2.new(1, 0, 0, 28)
            ButtonFrame.BackgroundTransparency = 1
            ButtonFrame.Parent = TabContent
            
            local Button = Instance.new("TextButton")
            Button.Size = UDim2.new(1, 0, 1, 0)
            Button.BackgroundColor3 = Window.Theme.Secondary
            Button.BorderSizePixel = 0
            Button.Text = name
            Button.TextColor3 = Window.Theme.Text
            Button.TextSize = 12
            Button.Font = Enum.Font.GothamSemibold
            Button.Parent = ButtonFrame
            
            local ButtonCorner = Instance.new("UICorner")
            ButtonCorner.CornerRadius = UDim.new(0, 6)
            ButtonCorner.Parent = Button
            
            -- Enhanced button animations with ripple
            enhancedButtonAnimation(Button, Window.Theme.Border, Window.Theme.Accent, true)
            
            -- Button functionality
            Button.MouseButton1Click:Connect(function()
                if callback then
                    pcall(callback)
                end
            end)
            
            -- Slide-in animation
            ButtonFrame.Size = UDim2.new(0, 0, 0, 28)
            TweenService:Create(ButtonFrame, TweenInfo.new(0.4, Enum.EasingStyle.Back), {
                Size = UDim2.new(1, 0, 0, 28)
            }):Play()
            
            return Button
        end
        
        function Tab:CreateToggle(name, default, callback)
            local ToggleFrame = Instance.new("Frame")
            ToggleFrame.Size = UDim2.new(1, 0, 0, 32)
            ToggleFrame.BackgroundTransparency = 1
            ToggleFrame.Parent = TabContent
            
            local ToggleLabel = Instance.new("TextLabel")
            ToggleLabel.Size = UDim2.new(1, -50, 1, 0)
            ToggleLabel.BackgroundTransparency = 1
            ToggleLabel.Text = name
            ToggleLabel.TextColor3 = Window.Theme.Text
            ToggleLabel.TextSize = 12
            ToggleLabel.TextXAlignment = Enum.TextXAlignment.Left
            ToggleLabel.Font = Enum.Font.Gotham
            ToggleLabel.Parent = ToggleFrame
            
            local ToggleButton = Instance.new("TextButton")
            ToggleButton.Size = UDim2.new(0, 40, 0, 20)
            ToggleButton.Position = UDim2.new(1, -45, 0.5, -10)
            ToggleButton.BackgroundColor3 = default and Window.Theme.Success or Window.Theme.Border
            ToggleButton.BorderSizePixel = 0
            ToggleButton.Text = ""
            ToggleButton.Parent = ToggleFrame
            
            local ToggleCorner = Instance.new("UICorner")
            ToggleCorner.CornerRadius = UDim.new(1, 0)
            ToggleCorner.Parent = ToggleButton
            
            local ToggleIndicator = Instance.new("Frame")
            ToggleIndicator.Size = UDim2.new(0, 16, 0, 16)
            ToggleIndicator.Position = default and UDim2.new(1, -18, 0.5, -8) or UDim2.new(0, 2, 0.5, -8)
            ToggleIndicator.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
            ToggleIndicator.BorderSizePixel = 0
            ToggleIndicator.Parent = ToggleButton
            
            local IndicatorCorner = Instance.new("UICorner")
            IndicatorCorner.CornerRadius = UDim.new(1, 0)
            IndicatorCorner.Parent = ToggleIndicator
            
            local enabled = default or false
            
            ToggleButton.MouseButton1Click:Connect(function()
                enabled = not enabled
                
                -- Animate toggle
                local targetPos = enabled and UDim2.new(1, -18, 0.5, -8) or UDim2.new(0, 2, 0.5, -8)
                local targetColor = enabled and Window.Theme.Success or Window.Theme.Border
                
                TweenService:Create(ToggleIndicator, TweenInfo.new(0.2, Enum.EasingStyle.Quart), {
                    Position = targetPos
                }):Play()
                
                TweenService:Create(ToggleButton, TweenInfo.new(0.2, Enum.EasingStyle.Quart), {
                    BackgroundColor3 = targetColor
                }):Play()
                
                -- Ripple effect
                Window.AnimationSystem:CreateRipple(ToggleButton, Color3.fromRGB(255, 255, 255))
                
                if callback then
                    pcall(callback, enabled)
                end
            end)
            
            -- Entrance animation
            ToggleFrame.Size = UDim2.new(0, 0, 0, 32)
            TweenService:Create(ToggleFrame, TweenInfo.new(0.4, Enum.EasingStyle.Back), {
                Size = UDim2.new(1, 0, 0, 32)
            }):Play()
            
            return {
                Toggle = ToggleButton,
                SetValue = function(value)
                    enabled = value
                    local targetPos = enabled and UDim2.new(1, -18, 0.5, -8) or UDim2.new(0, 2, 0.5, -8)
                    local targetColor = enabled and Window.Theme.Success or Window.Theme.Border
                    ToggleIndicator.Position = targetPos
                    ToggleButton.BackgroundColor3 = targetColor
                end,
                GetValue = function()
                    return enabled
                end
            }
        end
        
        function Tab:CreateSlider(name, min, max, default, callback)
            local SliderFrame = Instance.new("Frame")
            SliderFrame.Size = UDim2.new(1, 0, 0, 45)
            SliderFrame.BackgroundTransparency = 1
            SliderFrame.Parent = TabContent
            
            local SliderLabel = Instance.new("TextLabel")
            SliderLabel.Size = UDim2.new(1, -60, 0, 15)
            SliderLabel.BackgroundTransparency = 1
            SliderLabel.Text = name
            SliderLabel.TextColor3 = Window.Theme.Text
            SliderLabel.TextSize = 12
            SliderLabel.TextXAlignment = Enum.TextXAlignment.Left
            SliderLabel.Font = Enum.Font.Gotham
            SliderLabel.Parent = SliderFrame
            
            local ValueLabel = Instance.new("TextLabel")
            ValueLabel.Size = UDim2.new(0, 55, 0, 15)
            ValueLabel.Position = UDim2.new(1, -55, 0, 0)
            ValueLabel.BackgroundTransparency = 1
            ValueLabel.Text = tostring(default or min)
            ValueLabel.TextColor3 = Window.Theme.Accent
            ValueLabel.TextSize = 11
            ValueLabel.TextXAlignment = Enum.TextXAlignment.Right
            ValueLabel.Font = Enum.Font.GothamSemibold
            ValueLabel.Parent = SliderFrame
            
            local SliderTrack = Instance.new("Frame")
            SliderTrack.Size = UDim2.new(1, 0, 0, 4)
            SliderTrack.Position = UDim2.new(0, 0, 0, 25)
            SliderTrack.BackgroundColor3 = Window.Theme.Border
            SliderTrack.BorderSizePixel = 0
            SliderTrack.Parent = SliderFrame
            
            local TrackCorner = Instance.new("UICorner")
            TrackCorner.CornerRadius = UDim.new(1, 0)
            TrackCorner.Parent = SliderTrack
            
            local SliderFill = Instance.new("Frame")
            SliderFill.Size = UDim2.new(0, 0, 1, 0)
            SliderFill.BackgroundColor3 = Window.Theme.Accent
            SliderFill.BorderSizePixel = 0
            SliderFill.Parent = SliderTrack
            
            local FillCorner = Instance.new("UICorner")
            FillCorner.CornerRadius = UDim.new(1, 0)
            FillCorner.Parent = SliderFill
            
            local SliderKnob = Instance.new("Frame")
            SliderKnob.Size = UDim2.new(0, 12, 0, 12)
            SliderKnob.Position = UDim2.new(0, -6, 0.5, -6)
            SliderKnob.BackgroundColor3 = Window.Theme.Text
            SliderKnob.BorderSizePixel = 0
            SliderKnob.Parent = SliderTrack
            
            local KnobCorner = Instance.new("UICorner")
            KnobCorner.CornerRadius = UDim.new(1, 0)
            KnobCorner.Parent = SliderKnob
            
            -- Knob glow effect
            local knobGlow = Window.AnimationSystem:CreateGlow(SliderKnob, Window.Theme.Accent, 10)
            knobGlow.ImageTransparency = 1
            
            local currentValue = default or min
            local dragging = false
            
            local function updateSlider(value)
                currentValue = math.clamp(value, min, max)
                local percentage = (currentValue - min) / (max - min)
                
                TweenService:Create(SliderFill, TweenInfo.new(0.1), {
                    Size = UDim2.new(percentage, 0, 1, 0)
                }):Play()
                
                TweenService:Create(SliderKnob, TweenInfo.new(0.1), {
                    Position = UDim2.new(percentage, -6, 0.5, -6)
                }):Play()
                
                ValueLabel.Text = tostring(math.floor(currentValue * 100) / 100)
                
                if callback then
                    pcall(callback, currentValue)
                end
            end
            
            SliderTrack.InputBegan:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 then
                    dragging = true
                    TweenService:Create(knobGlow, TweenInfo.new(0.2), {ImageTransparency = 0.5}):Play()
                    TweenService:Create(SliderKnob, TweenInfo.new(0.2), {Size = UDim2.new(0, 16, 0, 16)}):Play()
                end
            end)
            
            UserInputService.InputEnded:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 and dragging then
                    dragging = false
                    TweenService:Create(knobGlow, TweenInfo.new(0.2), {ImageTransparency = 1}):Play()
                    TweenService:Create(SliderKnob, TweenInfo.new(0.2), {Size = UDim2.new(0, 12, 0, 12)}):Play()
                end
            end)
            
            UserInputService.InputChanged:Connect(function(input)
                if dragging and input.UserInputType == Enum.UserInputType.MouseMovement then
                    local mousePos = UserInputService:GetMouseLocation().X
                    local trackPos = SliderTrack.AbsolutePosition.X
                    local trackSize = SliderTrack.AbsoluteSize.X
                    local percentage = math.clamp((mousePos - trackPos) / trackSize, 0, 1)
                    local value = min + percentage * (max - min)
                    updateSlider(value)
                end
            end)
            
            -- Initialize slider
            updateSlider(currentValue)
            
            -- Entrance animation
            SliderFrame.Size = UDim2.new(0, 0, 0, 45)
            TweenService:Create(SliderFrame, TweenInfo.new(0.4, Enum.EasingStyle.Back), {
                Size = UDim2.new(1, 0, 0, 45)
            }):Play()
            
            return {
                SetValue = updateSlider,
                GetValue = function() return currentValue end
            }
        end
        
        function Tab:CreateTextbox(name, placeholder, callback)
            local TextboxFrame = Instance.new("Frame")
            TextboxFrame.Size = UDim2.new(1, 0, 0, 50)
            TextboxFrame.BackgroundTransparency = 1
            TextboxFrame.Parent = TabContent
            
            local TextboxLabel = Instance.new("TextLabel")
            TextboxLabel.Size = UDim2.new(1, 0, 0, 15)
            TextboxLabel.BackgroundTransparency = 1
            TextboxLabel.Text = name
            TextboxLabel.TextColor3 = Window.Theme.Text
            TextboxLabel.TextSize = 12
            TextboxLabel.TextXAlignment = Enum.TextXAlignment.Left
            TextboxLabel.Font = Enum.Font.Gotham
            TextboxLabel.Parent = TextboxFrame
            
            local TextboxInput = Instance.new("TextBox")
            TextboxInput.Size = UDim2.new(1, 0, 0, 28)
            TextboxInput.Position = UDim2.new(0, 0, 0, 20)
            TextboxInput.BackgroundColor3 = Window.Theme.Secondary
            TextboxInput.BorderSizePixel = 0
            TextboxInput.Text = ""
            TextboxInput.PlaceholderText = placeholder or "Enter text..."
            TextboxInput.TextColor3 = Window.Theme.Text
            TextboxInput.PlaceholderColor3 = Window.Theme.SubText
            TextboxInput.TextSize = 11
            TextboxInput.Font = Enum.Font.Gotham
            TextboxInput.ClearButtonOnFocus = false
            TextboxInput.Parent = TextboxFrame
            
            local TextboxCorner = Instance.new("UICorner")
            TextboxCorner.CornerRadius = UDim.new(0, 6)
            TextboxCorner.Parent = TextboxInput
            
            local TextboxStroke = Instance.new("UIStroke")
            TextboxStroke.Color = Window.Theme.Border
            TextboxStroke.Thickness = 1
            TextboxStroke.Parent = TextboxInput
            
            -- Focus animations
            TextboxInput.Focused:Connect(function()
                TweenService:Create(TextboxStroke, TweenInfo.new(0.2), {
                    Color = Window.Theme.Accent,
                    Thickness = 2
                }):Play()
            end)
            
            TextboxInput.FocusLost:Connect(function()
                TweenService:Create(TextboxStroke, TweenInfo.new(0.2), {
                    Color = Window.Theme.Border,
                    Thickness = 1
                }):Play()
                
                if callback then
                    pcall(callback, TextboxInput.Text)
                end
            end)
            
            -- Entrance animation
            TextboxFrame.Size = UDim2.new(0, 0, 0, 50)
            TweenService:Create(TextboxFrame, TweenInfo.new(0.4, Enum.EasingStyle.Back), {
                Size = UDim2.new(1, 0, 0, 50)
            }):Play()
            
            return {
                SetText = function(text)
                    TextboxInput.Text = text
                end,
                GetText = function()
                    return TextboxInput.Text
                end
            }
        end
        
        function Tab:CreateDropdown(name, options, callback)
            local DropdownFrame = Instance.new("Frame")
            DropdownFrame.Size = UDim2.new(1, 0, 0, 50)
            DropdownFrame.BackgroundTransparency = 1
            DropdownFrame.Parent = TabContent
            
            local DropdownLabel = Instance.new("TextLabel")
            DropdownLabel.Size = UDim2.new(1, 0, 0, 15)
            DropdownLabel.BackgroundTransparency = 1
            DropdownLabel.Text = name
            DropdownLabel.TextColor3 = Window.Theme.Text
            DropdownLabel.TextSize = 12
            DropdownLabel.TextXAlignment = Enum.TextXAlignment.Left
            DropdownLabel.Font = Enum.Font.Gotham
            DropdownLabel.Parent = DropdownFrame
            
            local DropdownButton = Instance.new("TextButton")
            DropdownButton.Size = UDim2.new(1, 0, 0, 28)
            DropdownButton.Position = UDim2.new(0, 0, 0, 20)
            DropdownButton.BackgroundColor3 = Window.Theme.Secondary
            DropdownButton.BorderSizePixel = 0
            DropdownButton.Text = options[1] or "Select..."
            DropdownButton.TextColor3 = Window.Theme.Text
            DropdownButton.TextSize = 11
            DropdownButton.Font = Enum.Font.Gotham
            DropdownButton.TextXAlignment = Enum.TextXAlignment.Left
            DropdownButton.Parent = DropdownFrame
            
            local DropdownCorner = Instance.new("UICorner")
            DropdownCorner.CornerRadius = UDim.new(0, 6)
            DropdownCorner.Parent = DropdownButton
            
            local DropdownPadding = Instance.new("UIPadding")
            DropdownPadding.PaddingLeft = UDim.new(0, 10)
            DropdownPadding.PaddingRight = UDim.new(0, 25)
            DropdownPadding.Parent = DropdownButton
            
            local ArrowIcon = Instance.new("TextLabel")
            ArrowIcon.Size = UDim2.new(0, 20, 1, 0)
            ArrowIcon.Position = UDim2.new(1, -20, 0, 0)
            ArrowIcon.BackgroundTransparency = 1
            ArrowIcon.Text = "▼"
            ArrowIcon.TextColor3 = Window.Theme.SubText
            ArrowIcon.TextSize = 10
            ArrowIcon.Font = Enum.Font.Gotham
            ArrowIcon.Parent = DropdownButton
            
            local DropdownList = Instance.new("Frame")
            DropdownList.Size = UDim2.new(1, 0, 0, math.min(#options * 25, 150))
            DropdownList.Position = UDim2.new(0, 0, 0, 50)
            DropdownList.BackgroundColor3 = Window.Theme.Secondary
            DropdownList.BorderSizePixel = 0
            DropdownList.Visible = false
            DropdownList.ZIndex = DropdownButton.ZIndex + 10
            DropdownList.Parent = DropdownFrame
            
            local ListCorner = Instance.new("UICorner")
            ListCorner.CornerRadius = UDim.new(0, 6)
            ListCorner.Parent = DropdownList
            
            local ListStroke = Instance.new("UIStroke")
            ListStroke.Color = Window.Theme.Border
            ListStroke.Thickness = 1
            ListStroke.Parent = DropdownList
            
            local OptionList = Instance.new("ScrollingFrame")
            OptionList.Size = UDim2.new(1, 0, 1, 0)
            OptionList.BackgroundTransparency = 1
            OptionList.BorderSizePixel = 0
            OptionList.ScrollBarThickness = 4
            OptionList.ScrollBarImageColor3 = Window.Theme.Accent
            OptionList.Parent = DropdownList
            
            local OptionLayout = Instance.new("UIListLayout")
            OptionLayout.SortOrder = Enum.SortOrder.LayoutOrder
            OptionLayout.FillDirection = Enum.FillDirection.Vertical
            OptionLayout.Parent = OptionList
            
            local isOpen = false
            local selectedValue = options[1]
            
            -- Create option buttons
            for i, option in ipairs(options) do
                local OptionButton = Instance.new("TextButton")
                OptionButton.Size = UDim2.new(1, 0, 0, 25)
                OptionButton.BackgroundColor3 = Window.Theme.Secondary
                OptionButton.BorderSizePixel = 0
                OptionButton.Text = option
                OptionButton.TextColor3 = Window.Theme.Text
                OptionButton.TextSize = 10
                OptionButton.Font = Enum.Font.Gotham
                OptionButton.TextXAlignment = Enum.TextXAlignment.Left
                OptionButton.ZIndex = DropdownList.ZIndex + 1
                OptionButton.Parent = OptionList
                
                local OptionPadding = Instance.new("UIPadding")
                OptionPadding.PaddingLeft = UDim.new(0, 10)
                OptionPadding.Parent = OptionButton
                
                OptionButton.MouseEnter:Connect(function()
                    TweenService:Create(OptionButton, TweenInfo.new(0.1), {
                        BackgroundColor3 = Window.Theme.Border
                    }):Play()
                end)
                
                OptionButton.MouseLeave:Connect(function()
                    TweenService:Create(OptionButton, TweenInfo.new(0.1), {
                        BackgroundColor3 = Window.Theme.Secondary
                    }):Play()
                end)
                
                OptionButton.MouseButton1Click:Connect(function()
                    selectedValue = option
                    DropdownButton.Text = option
                    
                    -- Close dropdown
                    isOpen = false
                    TweenService:Create(ArrowIcon, TweenInfo.new(0.2), {Rotation = 0}):Play()
                    TweenService:Create(DropdownList, TweenInfo.new(0.2, Enum.EasingStyle.Quart), {
                        Size = UDim2.new(1, 0, 0, 0)
                    }):Play()
                    
                    wait(0.2)
                    DropdownList.Visible = false
                    
                    if callback then
                        pcall(callback, selectedValue)
                    end
                end)
            end
            
            DropdownButton.MouseButton1Click:Connect(function()
                isOpen = not isOpen
                DropdownList.Visible = isOpen
                
                if isOpen then
                    TweenService:Create(ArrowIcon, TweenInfo.new(0.2), {Rotation = 180}):Play()
                    DropdownList.Size = UDim2.new(1, 0, 0, 0)
                    TweenService:Create(DropdownList, TweenInfo.new(0.3, Enum.EasingStyle.Quart), {
                        Size = UDim2.new(1, 0, 0, math.min(#options * 25, 150))
                    }):Play()
                else
                    TweenService:Create(ArrowIcon, TweenInfo.new(0.2), {Rotation = 0}):Play()
                    TweenService:Create(DropdownList, TweenInfo.new(0.2, Enum.EasingStyle.Quart), {
                        Size = UDim2.new(1, 0, 0, 0)
                    }):Play()
                    
                    wait(0.2)
                    DropdownList.Visible = false
                end
            end)
            
            -- Entrance animation
            DropdownFrame.Size = UDim2.new(0, 0, 0, 50)
            TweenService:Create(DropdownFrame, TweenInfo.new(0.4, Enum.EasingStyle.Back), {
                Size = UDim2.new(1, 0, 0, 50)
            }):Play()
            
            return {
                SetValue = function(value)
                    if table.find(options, value) then
                        selectedValue = value
                        DropdownButton.Text = value
                    end
                end,
                GetValue = function()
                    return selectedValue
                end
            }
        end
        
        return Tab
    end
    
    -- Enhanced tab switching with smooth transitions
    function Window:SwitchToTab(targetTab)
        if self.CurrentTab == targetTab then return end
        
        -- Update tab button states
        for _, tab in pairs(self.Tabs) do
            local isActive = tab == targetTab
            local targetColor = isActive and self.Theme.Accent or self.Theme.Background
            local textColor = isActive and self.Theme.Text or self.Theme.SubText
            local iconColor = isActive and self.Theme.AccentHover or self.Theme.SubText
            
            TweenService:Create(tab.Button, TweenInfo.new(0.3, Enum.EasingStyle.Quart), {
                BackgroundColor3 = targetColor
            }):Play()
            
            TweenService:Create(tab.Label, TweenInfo.new(0.3), {
                TextColor3 = textColor
            }):Play()
            
            TweenService:Create(tab.Icon, TweenInfo.new(0.3), {
                TextColor3 = iconColor
            }):Play()
            
            -- Hide inactive tab content
            if tab.Content and tab ~= targetTab then
                tab.Content.Visible = false
            end
        end
        
        -- Show new tab content with animation
        if targetTab.Content then
            targetTab.Content.Visible = true
            targetTab.Content.ScrollingFrame.CanvasPosition = Vector2.new(0, 0)
            
            -- Fade in animation for content
            for _, element in pairs(targetTab.Content:GetChildren()) do
                if element:IsA("GuiObject") and element.Name ~= "UIListLayout" and element.Name ~= "UIPadding" then
                    element.BackgroundTransparency = 1
                    if element:FindFirstChild("TextLabel") then
                        element:FindFirstChild("TextLabel").TextTransparency = 1
                    end
                    
                    TweenService:Create(element, TweenInfo.new(0.4, Enum.EasingStyle.Quart), {
                        BackgroundTransparency = 0
                    }):Play()
                    
                    if element:FindFirstChild("TextLabel") then
                        TweenService:Create(element:FindFirstChild("TextLabel"), TweenInfo.new(0.4), {
                            TextTransparency = 0
                        }):Play()
                    end
                end
            end
        end
        
        self.CurrentTab = targetTab
    end
    
    -- Auto-update canvas size for scrolling
    for _, tab in pairs(Window.Tabs) do
        if tab.Content then
            local layout = tab.Content:FindFirstChild("UIListLayout")
            if layout then
                layout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
                    tab.Content.CanvasSize = UDim2.new(0, 0, 0, layout.AbsoluteContentSize.Y + 20)
                end)
            end
        end
    end
    
    -- Handle teleportation
    TeleportService.TeleportInitFailed:Connect(function()
        Window.PersistenceHandler:SaveToClipboard()
    end)
    
    return Window
end

-- Example usage with advanced features
local function CreateExampleGUI()
    local Window = Library:CreateWindow("OwlHub Premium", "Dark")
    
    -- Main tab with various elements
    local MainTab = Window:CreateTab("Main", "🏠")
    MainTab:CreateSection("Player Features")
    
    MainTab:CreateButton("Super Speed", function()
        game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = 100
    end)
    
    local flyToggle = MainTab:CreateToggle("Flight", false, function(state)
        -- Flight implementation
        if state then
            print("Flight enabled")
        else
            print("Flight disabled")
        end
    end)
    
    local speedSlider = MainTab:CreateSlider("Walk Speed", 16, 200, 16, function(value)
        if game.Players.LocalPlayer.Character and game.Players.LocalPlayer.Character:FindFirstChild("Humanoid") then
            game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = value
        end
    end)
    
    MainTab:CreateSection("Teleportation")
    
    local playerDropdown = MainTab:CreateDropdown("Teleport to Player", {"Player1", "Player2", "Player3"}, function(selected)
        print("Teleporting to:", selected)
    end)
    
    local commandBox = MainTab:CreateTextbox("Command Input", "Enter command...", function(text)
        print("Command entered:", text)
    end)
    
    -- Combat tab
    local CombatTab = Window:CreateTab("Combat", "⚔️")
    CombatTab:CreateSection("Auto Features")
    
    CombatTab:CreateToggle("Auto Attack", false, function(state)
        print("Auto Attack:", state)
    end)
    
    CombatTab:CreateSlider("Attack Range", 10, 100, 50, function(value)
        print("Attack Range:", value)
    end)
    
    -- Visual tab
    local VisualTab = Window:CreateTab("Visuals", "👁️")
    VisualTab:CreateSection("ESP Features")
    
    VisualTab:CreateToggle("Player ESP", false, function(state)
        print("Player ESP:", state)
    end)
    
    VisualTab:CreateToggle("Item ESP", false, function(state)
        print("Item ESP:", state)
    end)
    
    -- Settings tab
    local SettingsTab = Window:CreateTab("Settings", "⚙️")
    SettingsTab:CreateSection("GUI Settings")
    
    SettingsTab:CreateButton("Save Config", function()
        print("Configuration saved")
    end)
    
    SettingsTab:CreateButton("Load Config", function()
        print("Configuration loaded")
    end)
    
    return Window
end

-- Initialize the GUI
CreateExampleGUI()
