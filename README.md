## 개요

0. 타입스크립트는 컴파일때에만 적용된다. js 에는 ts가 없다.
1. 그러므로 런타임때는 타입스크립트는 적용 안된다.

## 타입

0.  타입 지정은 할당한 값에 따라가는 추론이 적용된다.
1.  선언만 해버리면 any가 자동으로 따라붙으므로 타입을 정해주는것이 좋다.
    ```
    const a; //any
    const b:number;  //number
    ```
2.  타입스크립트용 타입 : turple(푸시가 허용됨.)

    ```
    //0 ; 숫자 1 은 문자만 허용 2개만 허용 그러나 푸시하면 타입이 보장안됨.
    type turple = [number,string]

    //number 와 string이 허용되는 array
    type array = (number|string)[]

    ```

3.  enum 상수를 일일히 지정하기 싫다면 편하다.
    ```
    enum Role {'doctor','patient'}
    ```
4.  typeof 타입으로 변환한다 이게 모든곳에 다 적용 할 수 있다.

    ```
    const a = ()=>({x:1,y:2})

    //{x:number,y:number}
    typeof a;
    ```

5.  enum 은 숫자를 바꿔버리면 바뀌므로 위험하다 이것을 그냥쓰지 말고 typeof 로 바꿔서 타입화 해보자.

    ```
    enum Role={
      'a'='a',
      'b'='b'
    }

    //newRole 'a'|'b'
    type newRole = keyof typeof Role;
    ```

6.  유니언 타입을 일부 수식이 이해를 못할때도 있다. 내가 모르는 예외가 있을 수 있음.

    ```
    type b = string|number;
    function combine(a: b, c: b) {
    if (typeof a === "number" && typeof c === "number") {
    a + c; //에러 없이 잘 됨.
    }

             a+c //에러 발생(string|number 는 + 연산자 사용할 수 없다.고 함.)

    }
    ```

7.  콜백함수는 리턴 타입을 무시 할 수 있다.

    ```
    function a() {
    return 1;
    }

    type ab = (a: () => void) => void;

    const fun: ab = (a) => {
    console.log(1);
    a(); //콜백함수는 return void 라도 값을 반환 할 수 있다 오류 안뜬다
    };

    ```

8.  unknown 미리 지정된 타입이 없다면 넘어간다.
    ```
    let b:string;
    let c:unknown = b  //오류가 남 b 는 이미 string이므로
    ```
9.  any 타입검사를 아예 안한다.
10. never 오류를 반환 하는 경우의 타입, 무한루프경우

## tsconfig

1. exclude

   ```
   //모든 폴더 ** 내에 모든 tscs.ts 파일은 컴파일 하지 마라.
   //node_modules 는 아무것도 안적어도 자동 exclude 된다.
    "exclude": ["**/*.dev.ts"]
   ```

2. include : 한번 설정 하면 모든 컴파일 할 파일 다 넣어야 함.
   ```
   //먼저 인클루드 한것 중에서 익스클루드를 빼는 것 같다.
   //서로 상충되는데 잘 작동한다 단 .dev.ts 는 컴파일 안된다.
   "exclude": ["**/*.dev.ts", "node_modules"],
   "include": ["src/**/*.ts"]
   ```
3. 파일단위 인클루드 "file"
   ```
     "files": ["app.ts"]
   ```
4. target 는 어떤 버전으로 컴파일 할건지? es6 == 2015 정도 레벨임
5. lib 는 안적으면 기본적인 methods properties가 사용될 수 있는 것들이 매핑된다. fetch addevent 등등.
   - 컴파일 할 js 버전에 따라 다르다.
   ```
   //target es6와 동일한 옵션
   "lib": [
      "ES6",
      "DOM",
      "DOM.Iterable",
      "ScriptHost"
    ]
   ```
6. sourcemap //ts로 디버깅 가능
7. rootdoor outdoor root //를 다른 폴더로 설정해도 가장 바깥에 있는 ts 파일 도 처리 해준다.
8. removecomments 주석제거 //파일 용량 줄여야지!
9. noemit js 파일 안만든다. //컴파일 하는데 시간 오래 걸리면 쓸 수도 있지.
10. no emit on error //에러있으면 컴파일 안한다. //에러있으면 시간 아껴야지.
11. "strict": true // 이 옵션 하나면 모든 strict options 가 true 인것과 같다.
    - nullcheck(말그대로임), implict(타입 설정 안해도 그냥 넘어간다)
12. additionalCheck 코드품질을 높게!!

## 타입 활용

1. 타입가드

   ```
   key in obj <-- 타입에 키값이 있을때 확인가능, 클레스 에서도 확인가능
   typeof val <-- 원시적인 타입만 확인가능
   instanceof <-- 클레스로 만든 인스턴스 확인가능 인스턴스 안된다 instance 설계도 말하는거임

   ```

2. 타입 구분법 인스턴스에 새로운 속성을 넣어주어라

   ```
   interface A {
   type: "A";
   flying(): void;
   }

    interface B {
    type: "B";
    running(): void;
    }

    type C = A | B;

    function move(animal: C) {
    switch (animal.type) {
    case "A":
    break;
    case "B":
    break;
    default:
    return;
    }
    }

   ```

3. 타입 강제 캐스팅 방법은 2개가 있는데 jsx 와 충돌 고려 해서 !as 가 좋은 것 같다.

   ```
   const dom = <HTMLParagraphElement>document.querySelector("p");

   //or
   // const dom = document.querySelector("p")! as HTMLParagraphElement;
   dom.addEventListener("click", () => {
   console.log(1);
   });

   ```

4. 키값 어떻게 타입을 주는지 몰랐는데 이렇게 하는거구나!!!!!

   ```
   type Errors={
       [prop: string]: string;
       }
   ```

5. 함수를 overload 도 할 수 있다. 조건이 까다로우니 고민 해서 만들어야 한다.

   - 모든 경우의 수를 다 넣어줘서 오류가 안생기게 만 들 수 있다.

   ```
    type a = string | number;

    function add(a: string, b: string): string;
    function add(a: number, b: number): number;
    function add(a: string, b: number): string;
    function add(a: number, b: string): string;
    function add(a: a, b: a) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
    }


   ```

6. ?? 는 undefined null 에서만 통과한다.

## 제네릭

1. 내장제네릭
   ```
   //내장 제네릭 어레이와 프라미스
   const ar: Array<string> = ["a"];
   const promise: Promise<string> = new Promise((resolve, reject) => {
   resolve("a");
   });
   ```
2. 함수 제네릭

   ```
   type a = { a: string };
   type b = { b: string };

   const ab = <A, B>(a: A, b: B) => {
   return Object.assign(a, b);
   };

   ab<a, b>({ a: "a" }, { b: "B" });
   ```

3. 선택형식 다음에 필수형식이 와야 한다.

   ```
   //선택 형식 이후 필수형식이 와야 한다.
   const ab = <A, B = b>(a: A, b: B) => {
   return Object.assign(a, b);
   };
   ```

4. keyof 는 그냥 extends keyof 로 쓰면되는듯 하다.

   ```
   type keyo = { a: "aa"; b: "bb"; c: "cc" };

   function extractt<O extends keyo, K extends keyof O>(obj: O, key: K) {
   console.log(obj[key]);
   return obj[key];
   }

   extractt<keyo, keyof keyo>({ a: "aa", b: "bb", c: "cc" }, "c");

   ```

5. 저장소에서는 타입을 원시타입으로 하는것이 좋다. 참조방식은 안좋음. 찾을수 없음. 메모리 주소가 달라서.
6. ts에서 자체 제공하는 여러 타입이 있다 partial readonly 등등

   ```
   type obj = {
      a: 1;
      b: 2;
      };

      function abc<T extends obj>(a: T): T {
      const temp: Partial<T> = {};

      temp.a = 1;
      temp.b = 2;

      return temp as T;
      }


      const arr: Readonly<number[]> = [1, 2, 3]

      arr.push(1); //오류
   ```

## Decorator target:es6, decorator:true

1. 퍼스트 클레스 데코레이터

   - 데코레이터는 함수다.
   - @ 는 ts 에 있는 특수한 기호다
   - 퍼스트 클레스 데코는 지정만 한다 @Logger (o), @Logger() (x)
   - 퍼스트 클레스 데코는 인자로 컨스트럭터를 받는다(클레스 정의)
   - 모든 데코레이터는 클레스를 인스턴트화 안해도 실행된다 즉
   - 클레스 정의할때 실행된다.(해당 클레스가 인스턴스화 안되도 똑같이 실행됨)
   - 단 클레스 팩토리에서 클레스를 반환하는 데코레이터를 리턴할때는 함수가 인스턴스 될때 실행됨.

   ```
   function Logger(constractor: Function) {
   console.log("logger");
   }

   @Logger   //밑에 클레스가 인스턴스되던 말던 일단 콘솔로그거 찍힌다.
   class Person {
   nam = "peter";

   constractor() {
      console.log("good person");
   }
   }

   ```

2. 데코레이터 팩토리 데코레이터를 반환하는 함수

   - 데코레이터를 반환한다
   - 이번엔 지정이 아니라 실행한다 @Logger()
   - 처음엔 위에서 아래로 그 다음 리턴된 것들은 아래서 위로 순서로 실행된다.
   - 처음 팩토리에서 실행되는 함수는 외부에서 인자를 받아서 들여올 수 있다.

   ```
   function Logger(arg: string) {
   //원하는 인자를 받아서 사용할 수 있따.
   console.log("logger");
   //데코레이터가 정의된 익명함수를 반환한다.
   return function (constractor: Function) {
      console.log("returnedDeco");
      console.log("returnedDeco2");
   };
   }

   @Logger("옛다!! 인자!")
   class Person {
   nam = "peter";

   constractor() {
      console.log("good person");
   }
   }

   ```

3. 데코레이터 팩토리의 예시(클레스 시작전에 랜더링 하기) / 이것이 바로 메타 프로그래밍이다.! 뒤에서 다 처리함!

   - 만약 뒷처리 하는 로직이 공통으로 사용하는 라이브러리 라면 정말 유용 할듯 하다.

   ```
   function WithTemplate(template: string, hookId: string) {
   return function (_: Function) {
    const parent = document.getElementById(hookId)! as HTMLDivElement;
    parent.innerHTML = template;
   };
   }

   // @Logger("옛다!! 인자!")
   @WithTemplate("<div>hellow<div>", "id")
   class Person {
   nam = "peter";

   constractor() {
      console.log("good person");
   }
   }
   ```

4. 컨스트럭터 인자로 클레스를 만들어서 클레스 멤버를 이용 할 수도 있다.

   ```
   function WithTemplate(template: string, hookId: string) {
   return function (constractor: { new (...arg: any[]): Person }) {
    const p = new constractor();
    const parent = document.getElementById(hookId)! as HTMLDivElement;
    parent.innerHTML = template;
    parent.querySelector("div")!.textContent = p.nam;
   };
   }

   // @Logger("옛다!! 인자!")
   @WithTemplate("<div>hellow<div>", "id")
   class Person {
   nam = "peteraa";

   constractor() {
      console.log("good person");
   }
   }


   //위에서 좀더 개선 : 아예 클레스를 리턴해 버리면 불필요하게 인스턴스 반복 안해도 된다. 딱 한번 인스턴스 화 될때만 실행된다.
   function WithTemplate(template: string, hookId: string) {
   console.log("tem1");
   return function (constractor: { new (...arg: any[]): Person }) {
    return class extends constractor {
      constructor() {
        super();
        console.log("tem222222222");
        const parent = document.getElementById(hookId)! as HTMLDivElement;
        parent.innerHTML = template;
        parent.querySelector("div")!.textContent = this.nam;
      }
    };
   };
   }
   ```

5. 데코레이터 추가 할수 있는 곳 (클레스 바로 정의위, 메서드, 생성자를 제외한 멤버(속성, 메서드 등))

   - 특징 : 멤버에 쓰인 데코는 무언가를 반환하지만, 매개변수에 쓰인 데코는 아무것도 반환하지 않는다.
   - 메서드에 추가시 3개의 파라미터를 받는다(target:생성자, name:접근자, PropertyDescriptor:PropertyDescriptor)
   - 속성에 추가시 2개의 파라미터를 받는다(target:생성자, name:접근자)
   - 매개변수에 추가시 3개의 파라미터를 받는다(target:생성자, name:접근자, position:매개변수 위치 왼쪽부터 0)

   ```
   function Log(target: any, name: string | symbol) {
   console.log(target);
   console.log(name);
   // const instanceNew = new target();
   }

   function Log2(
   target: any,
   name: string | symbol,
   descriptor: PropertyDescriptor
   ) {
   console.log("log2");
   console.log(target);
   console.log(name);
   console.log(descriptor);
   }

   function Log3(
   target: any,
   name: string | symbol,
   descriptor: PropertyDescriptor
   ) {
   console.log("log3)");
   console.log(target);
   console.log(name);
   console.log(descriptor);
   }

   function Arg(target: any, name: string | symbol, position: number) {
   console.log("arg1");
   console.log(target);
   console.log(name);
   console.log(position);
   }

   class Tax {
   @Log
   text: string;
   private price: number;

   constructor(t: string, p: number) {
      this.text = t;
      this.price = p;
   }

   @Log3
   set setPrice(@Arg p: number) {
      this.price = p;
   }

   @Log2
   caculate(@Arg rate: number): string {
      return `${this.price * rate}원`;
   }
   }

   ```

6. 혹시 사용하지 않는 argment가 있어서 오류가 난다면

   ```
   constructor(..._: any[]) {   /<==이렇게 처리해주자
   ```

7. 오토 바인딩 하는 예시(매서드 변경 하는 방법)

   ```
   function Au(_: any, _2: string, descriptor: PropertyDescriptor) {
   const originalMethod = descriptor.value;
   const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
   };
   return adjDescriptor;
   }

   class Print {
   message: string;
   constructor() {
      this.message = "hellow";
   }

   @Au
   print() {
      alert(this.message);
   }
   }
   ```

8. validation decorator 제작 역시 서브파티를 데코레이터에 넣으면 좋을듯

   ```
   type Valu = {
   [k: string]: {
      [k: string]: string[];
   };
   };

   type UnionValues = {
   title: string;
   price: number;
   };

   interface IDump {
   title: string;
   price: number;
   }

   const config: Valu = {};

   function Re(t: any, n: string) {
   const name = t.constructor.name;
   config[name] = {
      ...config[name],
      [n]: [...(config[name]?.[n] ?? []), "required"],
   };
   }

   function Po(t: any, n: string) {
   const name = t.constructor.name;
   config[name] = {
      ...config[name],
      [n]: [...(config[name]?.[n] ?? []), "positive"],
   };
   }

   function valid(dump: any): boolean {
   const vals = config[dump.constructor.name];
   let result = true;

   for (const key in vals) {
      for (const item of vals[key]!) {
         switch (item) {
         case "required":
            result = !!dump[key];
            break;
         case "positive":
            result = dump[key] > 0;
            break;
         default:
            throw new Error("error");
         }
      }
   }

   return result;
   ```
