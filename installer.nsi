; Modern User Interface 2
!include "MUI2.nsh"
!include "LogicLib.nsh"

; Pages for the installer
!define MUI_PAGE_HEADER_TEXT "Activation"
!define MUI_PAGE_HEADER_SUBTEXT "Please enter your activation key"

; Custom page for activation key
Page custom EnterActivationKey

; Language settings
!insertmacro MUI_LANGUAGE "English"

; Installer name and output
Name "Billing App Activation"
OutFile "BillingActivation.exe"

; Vars for activation key
Var ActivationKeyDialog
Var ActivationKeyLabel
Var ActivationKeyInput

; Function to show activation key dialog
Function EnterActivationKey
    nsDialogs::Create 1018
    Pop $ActivationKeyDialog
    ${If} $ActivationKeyDialog == error
        Abort
    ${EndIf}

    ${NSD_CreateLabel} 0 0 100% 24 "Please enter your activation key:"
    Pop $ActivationKeyLabel

    ${NSD_CreateText} 0 25 100% 24 ""
    Pop $ActivationKeyInput

    nsDialogs::Show
FunctionEnd

; Empty installation process to bypass logic
Section
SectionEnd