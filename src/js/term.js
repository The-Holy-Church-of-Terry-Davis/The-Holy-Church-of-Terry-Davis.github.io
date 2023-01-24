const ls = 'Directory of C:/Home\nDATE_  TIME_  SIZE\n01/23  14:00  0000  .\n01/23  14:00  0000  ..\n01/23  14:03  0030  invite.TXT\n01/24  9:14  0132  aboutus.TXT\n??/??  ??:??  0427  runme.HC\n0.005024s  ans=0x00000007=7';
const aboutus ='We are THE Holy Church of Terry Davis.\nHere at THCoTD we:\n    - Shitpost\n    - Worship Terry\n    - Do community coding projects';
const invte = 'https://discord.gg/xEFtNzEzE8';

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
    "Type(": function(file) {
        if (file.toLower() == '"aboutus.txt");' || "'aboutus.txt');") {
            this.echo(aboutus);
        } else if (file.toLower() == '"invite.txt");' || "'invite.txt');") {
            this.echo(invite);
        } else {
            this.echo("ERROR! File not found.");
        }
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