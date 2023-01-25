const ls = 'Directory of C:/Home\nDATE_  TIME_  SIZE\n01/23  14:00  0000  .\n01/23  14:00  0000  ..\n01/23  14:00  0416  DoDistro.HC.Z\n01/23  14:00  013E  MakeHome.HC.Z\n01/23  14:00  01D3  Registry.HC.Z\n01/24  09:14  0132  AboutUs.TXT\n01/25  08:45  0050  GitHubOrg.TXT\n01/23  14:03  0030  Invite.TXT\n01/25  08:46  0091  ThisRepo.TXT\n0.012000s  ans=0x0000000A=10';
const aboutus ='We are THE Holy Church of Terry Davis.\nHere at THCoTD we:\n    - Shitpost\n    - Worship Terry\n    - Do community coding projects';
const invite = 'https://discord.gg/xEFtNzEzE8';
const makehome = 'Cd(__DIR__);;\n//If these are not present in /Home, it uses the version in the root dir. You\n//can make your own, modified, version of these files in your /Home directory.\n#include "~/HomeLocalize"\n#include "/Adam/Opt/Boot/MakeBoot"\n#include "/Adam/Opt/Utils/MakeUtils"\n#include "~/HomeWrappers"\nMapFileLoad("::/Kernel/Kernel");\nMapFileLoad("::/Compiler/Compiler");\n#include "~/HomeKeyPlugIns"\n#include "~/HomeSys"\nCd("..");;\n\n0.000211s ans=0x00000001=1';
const registry = '+] Adam\n+] Once\n\n0.000310s ans=0x00000001=1';
const ghorg = 'https://github.com/The-Holy-Church-of-Terry-Davis';
const thisrepo = 'https://github.com/The-Holy-Church-of-Terry-Davis/The-Holy-Church-of-Terry-Davis.github.io';
const dodistro = '//Make Your own Distro by #include-ing this file.\n\n#define STD_DISTRO_DVD_CFG      "TB\nScale2Mem(2048,0x40000)\nT \n\n\n\n"\n\nU0 MakeMyISO(U8 *_out_iso_filename)\n{//Does everything with current drive.\n//If you have not recompiled Kernel and defined your CD/DVD drive, use Mount.\n  U8 *out_iso_filename=FileNameAbs(_out_iso_filename);\n  if (!DrvIsWritable) {\n    "Drive must be writable.  Install on Hard drive, first.\n";\n    return;\n  }\n  DelTree("/Distro");\n  Del(out_iso_filename);\n\n  DirMk("/Distro");\n  In(STD_DISTRO_DVD_CFG);\n  BootDVDIns;\n\n  Copy("/*","/Distro");\n  Del("/Distro/" KERNEL_BIN_C);\n\n  CopyTree(BOOT_DIR,    "/Distro" BOOT_DIR);\n  CopyTree("/Home",     "/Distro/Home");\n  CopyTree("/Adam",     "/Distro/Adam");\n  CopyTree("/Apps",     "/Distro/Apps");\n  CopyTree("/Compiler", "/Distro/Compiler");\n  CopyTree("/Demo",     "/Distro/Demo");\n  CopyTree("/Doc",      "/Distro/Doc");\n  CopyTree("/Kernel",   "/Distro/Kernel");\n  CopyTree("/Misc",     "/Distro/Misc");\n\n  //To save space, optionally delete dictionary.\n  //Del("/Distro/Adam/AutoComplete/ACDefs.DATA");\n  CopyTree("/Downloads","/Distro/Downloads");     //You can leave this out.\n  DirMk("/Distro/Tmp");\n  DirMk("/Distro/Tmp/ScrnShots");\n  RedSeaISO(out_iso_filename,"/Distro","/Distro" BOOT_DIR_KERNEL_BIN_C);\n\n  //If CD-ROM use MT_CD instead of MT_DVD.\n  //DVDImageWrite(\'T\',out_iso_filename,MT_DVD); //Uncomment to burn.\n\n  //DelTree("/Distro");\n  Free(out_iso_filename);\n}\n\nMakeMyISO("/Tmp/MyDistro.ISO.C");\n\n// Study my account examples Cfg Strs, Update Funs.';

$('body').terminal({
    "Dir;": function() {
        this.echo(ls);
    },
    "Dir();": function() {
        this.echo(ls);
    },
    "Reboot;": function() {
        location.reload();
    },
    "Reboot();": function() {
        location.reload();
    },
    "DocClear;": function() {
        this.clear();
    },
    "$CL$": function() {
        this.clear();
    },
    'Type("AboutUs.TXT");': function() {
        this.echo(aboutus);
    },
    'Type("Invite.TXT");': function() {
        this.echo(invite);
    },
    'Type("MakeHome.HC.Z");': function() {
        this.echo(makehome);
    },
    'Type("Registry.HC.Z");': function() {
        this.echo(registry);
    },
    'Type("GitHubOrg.TXT");': function() {
        this.echo(ghorg);
    },
    'Type("ThisRepo.TXT");': function() {
        this.echo(thisrepo);
    },
    'Type("DoDistro.HC.Z");': function() {
        this.echo(dodistro);
    },
    'Cd(".");': function() {
        this.echo("0.000041s ans=0x00000001=1");
    },
    'Cd("..");': function() {
        this.echo("ERROR! Unable.");
    }
    
},
 {
    prompt: 'C:/Home>',
    greetings: ls, 
    clear: false,
    login: function(user, password, callback) {
        if (user == 'demo' && password == 'secret') {
            this.clear();
            callback('AUTHENTICATION TOKEN');
        } else {
            callback(null);
        }
    },
    onCommandNotFound: function(command, terminal) {
        this.echo("ERROR: Undefined identifier at \"" + command + "\"");
    }
});

/*
onCommandNotFound [function(command, terminal)]
        function is executed if there are no commands with
    that name, by default terminal display error message,
    it will not work if you use function as an interpreter.
*/