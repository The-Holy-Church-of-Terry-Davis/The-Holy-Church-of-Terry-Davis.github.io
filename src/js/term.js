const ls = 'Directory of C:/Home\nDATE_  TIME_  SIZE\n01/23  14:00  0000  .\n01/23  14:00  0000  ..\n01/23  14:03  0002  file1.TXT\n01/23  14:06  0016  file2.TXT\n??/??  ??:??  0427  runme.HC\n0.005024s  ans=0x00000007=7';

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