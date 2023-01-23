const ls = 'Directory of C:/Home\nDATE_  TIME_  SIZE\n01/23  14:00  0000  .\n01/23  14:00  0000  ..\n01/23  14:03  0002  file1.TXT\n01/23  14:06  0016  file2.TXT\n0.005024s  ans=0x00000007=7';

$('body').terminal({
    "Dir;": function() {
        this.echo(ls);
    },
    "Dir();": function() {
        this.echo(ls);
    }
},
 {
    prompt: 'C:/Home>',
    greetings: 'Welcome to The Holy Church of Terry Davis'
});