; Modern User Interface 2
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "Validation.nsh"

; Installer configuration
Name "Billing App"
OutFile "BillingInstaller.exe"
RequestExecutionLevel admin

; Define the license file path
!define MUI_LICENSEFILE "LICENSE.txt"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_PAGE_HEADER_TEXT "Activation"
!define MUI_PAGE_HEADER_SUBTEXT "Please enter your activation key"

; Pages
Var ActivationDialog
Var ActivationKeyInput
Var ActivationKeyLabel
Var ActivationStatus

; Define custom pages
Page custom EnterActivationPage ValidateActivation
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "${MUI_LICENSEFILE}"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Language
!insertmacro MUI_LANGUAGE "English"

; Installer directory
InstallDir "$PROGRAMFILES64\BillingApp"

; Activation Key Validation Function
Function ValidateActivationKey
    ; Replace this with your actual activation key validation logic
    ; This is a placeholder example
    ${If} $ActivationKeyInput == ""
        MessageBox MB_OK|MB_ICONERROR "Activation key cannot be empty!"
        Abort
    ${EndIf}

    ; Example validation (replace with your own implementation)
    ${If} $ActivationKeyInput != "SAMPLE-KEY-12345"
        MessageBox MB_OK|MB_ICONERROR "Invalid activation key!"
        Abort
    ${EndIf}

    ; If validation passes, continue with installation
    Return
FunctionEnd

; Custom Page for Activation Key
Function EnterActivationPage
    nsDialogs::Create 1018
    Pop $ActivationDialog

    ${If} $ActivationDialog == error
        Abort
    ${EndIf}

    ; Activation Key Label
    ${NSD_CreateLabel} 0 0 100% 24u "Enter Activation Key:"
    Pop $ActivationKeyLabel

    ; Activation Key Input
    ${NSD_CreateText} 0 25u 100% 24u ""
    Pop $ActivationKeyInput

    ; Status Label
    ${NSD_CreateLabel} 0 55u 100% 24u ""
    Pop $ActivationStatus

    nsDialogs::Show
FunctionEnd

; Installation Section
Section "Install"
    ; Validate activation key again (double-check)
    Call ValidateActivationKey

    ; Set output directory
    SetOutPath "$INSTDIR"

    ; Install files
    File /r "dist"
    File "main.js"
    File "preload.js"

    ; Create desktop shortcut
    CreateShortcut "$DESKTOP\Billing App.lnk" "$INSTDIR\Billing.exe"

    ; Write uninstall information
    WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

; Uninstall Section
Section "Uninstall"
    ; Remove installed files
    Delete "$INSTDIR\Uninstall.exe"
    RMDir /r "$INSTDIR"
    
    ; Remove desktop shortcut
    Delete "$DESKTOP\Billing App.lnk"
SectionEnd

; Post-installation section for logging and cleanup
Function .onInstSuccess
    ; You can add post-installation tasks here
    MessageBox MB_OK "Billing App installed successfully!"
FunctionEnd

; Error handling
Function .onInstFailed
    MessageBox MB_OK|MB_ICONERROR "Installation failed. Please check the activation key and try again."
FunctionEnd