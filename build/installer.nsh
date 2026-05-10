/**
 * 云书 Windows 安装程序自定义脚本
 * NSIS (Nullsoft Scriptable Install System) 配置
 */

!macro customHeader
    ; 自定义安装程序头部
    !system "echo '云书安装程序 v2.5.0'"
!macroend

!macro preInit
    ; 初始化注册表项
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
    
    ; 设置应用数据目录
    ExpandEnvStrings $0 "%APPDATA%"
    CreateDirectory "$0\云书"
!macroend

!macro customInit
    ; 检查是否已安装
    ReadRegStr $0 HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation
    StrCmp $0 "" fresh_install
    
    ; 已安装，询问是否覆盖
    MessageBox MB_YESNO|MB_ICONQUESTION \
        "检测到已安装云书，是否覆盖安装？$\n$\n当前安装路径: $0" \
        /SD IDYES IDYES fresh_install
    Abort
    
    fresh_install:
!macroend

!macro customInstall
    ; 创建应用数据目录
    ExpandEnvStrings $0 "%APPDATA%"
    CreateDirectory "$0\云书"
    CreateDirectory "$0\云书\projects"
    CreateDirectory "$0\云书\backups"
    CreateDirectory "$0\云书\exports"
    
    ; 创建卸载快捷方式
    CreateShortCut "$SMPROGRAMS\云书\卸载云书.lnk" "$INSTDIR\Uninstall 云书.exe"
    
    ; 注册文件关联
    WriteRegStr HKCR ".yunshu" "" "Yunshu.Project"
    WriteRegStr HKCR "Yunshu.Project" "" "云书项目文件"
    WriteRegStr HKCR "Yunshu.Project\DefaultIcon" "" "$INSTDIR\云书.exe,0"
    WriteRegStr HKCR "Yunshu.Project\shell\open\command" "" '"$INSTDIR\云书.exe" "%1"'
    
    ; 注册 URL 协议
    WriteRegStr HKCR "yunshu" "" "URL:云书协议"
    WriteRegStr HKCR "yunshu" "URL Protocol" ""
    WriteRegStr HKCR "yunshu\shell\open\command" "" '"$INSTDIR\云书.exe" "%1"'
!macroend

!macro customUnInstall
    ; 删除注册表项
    DeleteRegKey HKCR ".yunshu"
    DeleteRegKey HKCR "Yunshu.Project"
    DeleteRegKey HKCR "yunshu"
    
    ; 询问是否删除用户数据
    MessageBox MB_YESNO|MB_ICONQUESTION \
        "是否删除所有应用数据（包括项目、备份、设置等）？$\n$\n选择「否」将保留用户数据。" \
        /SD IDNO IDNO keep_data
    
    ; 删除用户数据
    ExpandEnvStrings $0 "%APPDATA%"
    RMDir /r "$0\云书"
    
    keep_data:
!macroend

!macro customRemoveFiles
    ; 清理临时文件
    Delete "$TEMP\yunshu*.tmp"
!macroend
