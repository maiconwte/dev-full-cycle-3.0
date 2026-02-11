****# Domain-Driven Design (DDD) - Cast Member Module

Este módulo implementa os conceitos fundamentais de DDD: **Value Objects**, **Entities** e **Aggregates**.

## 📋 Estrutura do Módulo

```
cast-member/domain/
├── cast-member.aggregate.ts      # Agregado Raiz
├── cast-member-type.vo.ts        # Objeto de Valor
├── cast-member.repository.ts     # Contrato do Repositório
├── cast-member.validator.ts      # Validações de Domínio
└── cast-member-fake.builder.ts   # Builder para testes
```

---

## 🎯 Conceitos DDD Aplicados

### 1. **Value Objects (Objetos de Valor)**

**Características:**
- ✅ Imutáveis (`readonly`)
- ✅ Identificados por **valor**, não por identidade
- ✅ Auto-validação na criação
- ✅ Igualdade por valor (herda `equals()` de `ValueObject`)

**Exemplos no módulo:**

#### `CastMemberType`
```typescript
export class CastMemberType extends ValueObject {
  constructor(readonly type: CastMemberTypes) {
    super();
    this.validate();  // Valida: DIRECTOR (1) ou ACTOR (2)
  }
}
```

**Uso:**
```typescript
const actor = CastMemberType.createAnActor();
const director = CastMemberType.createADirector();
```

#### `CastMemberId` (herda de `Uuid`)
```typescript
export class CastMemberId extends Uuid {}
```

**Características:**
- Valida formato UUID automaticamente
- Imutável após criação
- Comparação por valor

---

### 2. **Entities (Entidades)**

**Características:**
- ✅ Possuem **identidade única** (`entity_id`)
- ✅ Mutáveis (podem mudar mantendo a mesma identidade)
- ✅ Sistema de notificações para erros de validação

**Classe Base:**
```typescript
export abstract class Entity {
  notification: Notification = new Notification();
  abstract get entity_id(): ValueObject;
  abstract toJSON(): any;
}
```

---

### 3. **Aggregates (Agregados)**

**Características:**
- ✅ Cluster de entidades e value objects tratados como **unidade de consistência**
- ✅ **Raiz do Agregado** controla acesso e garante invariantes
- ✅ Gerencia eventos de domínio

**Exemplo: `CastMember` (Aggregate Root)**

```typescript
export class CastMember extends AggregateRoot {
  cast_member_id: CastMemberId;    // Value Object (identidade)
  name: string;                     // Atributo simples
  type: CastMemberType;             // Value Object
  created_at: Date;                  // Atributo simples
}
```

**Hierarquia:**
```
AggregateRoot
    ↓
  Entity
    ↓
CastMember
```

**Responsabilidades:**

1. **Garantir Invariantes:**
```typescript
static create(props: CastMemberCreateCommand) {
  const castMember = new CastMember(props);
  castMember.validate(['name']);  // Valida antes de retornar
  return castMember;
}
```

2. **Controlar Mudanças:**
```typescript
changeName(name: string): void {
  this.name = name;
  this.validate(['name']);  // Valida após mudança
}

changeType(type: CastMemberType): void {
  this.type = type;  // CastMemberType já valida internamente
}
```

3. **Gerenciar Eventos de Domínio:**
```typescript
// Herdado de AggregateRoot
applyEvent(event: IDomainEvent) {
  this.events.add(event);
  this.localMediator.emit(event.constructor.name, event);
}
```

---

## 🔄 Diagrama de Relacionamento

```
┌─────────────────────────────────────────┐
│      CastMember (Aggregate Root)        │
│  ┌──────────────────────────────────┐  │
│  │ cast_member_id: CastMemberId     │  │ ← Value Object
│  │ name: string                      │  │ ← Atributo simples
│  │ type: CastMemberType              │  │ ← Value Object
│  │ created_at: Date                  │  │ ← Atributo simples
│  └──────────────────────────────────┘  │
│                                         │
│  Métodos:                               │
│  - create()                            │
│  - changeName()                        │
│  - changeType()                        │
│  - validate()                          │
└─────────────────────────────────────────┘
           │
           │ usa
           ↓
┌──────────────────────────────┐
│   CastMemberType (VO)        │
│  ┌────────────────────────┐  │
│  │ type: CastMemberTypes  │  │
│  │ - DIRECTOR = 1         │  │
│  │ - ACTOR = 2            │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

---

## 📊 Comparação: Value Object vs Entity

| Característica | Value Object | Entity |
|---------------|--------------|--------|
| **Identidade** | Por valor | Por ID |
| **Mutabilidade** | Imutável | Mutável |
| **Igualdade** | Compara valores | Compara IDs |
| **Exemplo** | `CastMemberType` | `CastMember` |
| **Ciclo de vida** | Criado e descartado | Criado e modificado |

---

## 🏗️ Repository Pattern

**Interface:**
```typescript
export interface ICastMemberRepository extends ISearchableRepository<
  CastMember,           // Agregado
  CastMemberId,         // ID (Value Object)
  CastMemberFilter,     // Filtros
  CastMemberSearchParams,
  CastMemberSearchResult
> {}
```

**Características:**
- ✅ Abstração de persistência
- ✅ Trabalha com agregados completos
- ✅ Contrato independente de implementação

---

## ✅ Princípios Aplicados

### 1. **Encapsulamento**
```typescript
changeType(type: CastMemberType): void {
  this.type = type;  // CastMemberType já valida internamente
}
```

### 2. **Invariantes**
```typescript
static create(props: CastMemberCreateCommand) {
  const castMember = new CastMember(props);
  castMember.validate(['name']);  // Invariante: nome deve ser válido
  return castMember;
}
```

### 3. **Imutabilidade em Value Objects**
```typescript
constructor(readonly type: CastMemberTypes) {
  // Não pode ser alterado após criação
}
```

### 4. **Factory Methods**
```typescript
CastMemberType.createAnActor()    // Mais semântico que new CastMemberType(2)
CastMemberType.createADirector()  // Mais semântico que new CastMemberType(1)
```

---

## 🎯 Benefícios

1. **Consistência**: Validações no domínio garantem dados sempre válidos
2. **Testabilidade**: Value Objects e Entities são fáceis de testar isoladamente
3. **Manutenibilidade**: Regras de negócio centralizadas no domínio
4. **Expressividade**: Código reflete o domínio do negócio
5. **Segurança**: Invariantes protegidas pelo agregado

---

## 📝 Resumo Prático

- **Value Objects** (`CastMemberType`, `Uuid`): Imutáveis, validam a si mesmos, igualdade por valor
- **Entities** (`Entity`): Têm identidade, podem mudar ao longo do tempo
- **Aggregates** (`CastMember`): Raiz que controla acesso e garante consistência
- **Repository** (`ICastMemberRepository`): Abstração de persistência

---

## 🔗 Referências

- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [Value Objects vs Entities](https://martinfowler.com/bliki/ValueObject.html)
- [Aggregate Pattern](https://martinfowler.com/bliki/DDD_Aggregate.html)
