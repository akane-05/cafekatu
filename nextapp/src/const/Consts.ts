const validPattern = {
    nickname: '^.{2,20}$',
    email:
    '^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*.)+[a-zA-Z]{2,}$',
    password: '^([a-zA-Z0-9]{8})$'

};

const requests = {
base:'http://localhost:8080',
register:`/register`,
test:`/testcafes?`

};

  export { validPattern,requests}
