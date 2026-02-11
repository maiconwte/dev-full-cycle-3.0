# Domain-Driven Design (DDD) - Category Module

Este módulo implementa os conceitos fundamentais de DDD: **Value Objects**, **Entities** e **Aggregates**.

## 📋 Estrutura do Módulo

```
category/domain/
├── category.aggregate.ts         # Agregado Raiz
├── category.repository.ts        # Contrato do Repositório
├── category.validator.ts         # Validações de Domínio
├── category-fake.builder.ts      # Builder para testes
├── notification.ts               # Sistema de notificações
└── validator-fields-interface.ts # Interface para validadores
```

---

## 🎯 Conceitos DDD Aplicados

### 1. **Value Objects (Objetos de Valor)**

**Características:**
- ✅ Imutáveis (`readonly`)
- ✅ Identificados por **valor**, não por identidade
- ✅ Auto-validação na criação
- ✅ Igualdade por valor (herda `equals()` de `ValueObject`)

**Exemplo no módulo:**

#### `CategoryId` (herda de `Uuid`)
```typescript
export class CategoryId extends Uuid {}
```

**Características:**
- Valida formato UUID automaticamente
- Imutável após criação
- Comparação por valor
- Usado como identidade da entidade `Category`

**Uso:**
```typescript
const categoryId = new CategoryId();
// ou
const categoryId = new CategoryId('existing-uuid-string');
```

**Nota:** Diferente do módulo `cast-member`, o módulo `category` não possui Value Objects próprios além do ID. Os atributos `name`, `description` e `is_active` são tipos primitivos, o que é uma escolha válida quando não há necessidade de encapsular lógica adicional.

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

**Exemplo: `Category` (Aggregate Root)**

```typescript
export class Category extends AggregateRoot {
  category_id: CategoryId;        // Value Object (identidade)
  name: string;                    // Atributo simples
  description: string | null;      // Atributo simples (opcional)
  is_active: boolean;              // Atributo simples (estado)
  created_at: Date;                // Atributo simples
}
```

**Hierarquia:**
```
AggregateRoot
    ↓
  Entity
    ↓
Category
```

**Responsabilidades:**

1. **Garantir Invariantes:**
```typescript
static create(props: CategoryCreateCommand): Category {
  const category = new Category(props);
  category.validate(['name']);  // Valida nome antes de retornar
  return category;
}
```

2. **Controlar Mudanças:**
```typescript
changeName(name: string): void {
  this.name = name;
  this.validate(['name']);  // Valida após mudança
}

changeDescription(description: string | null): void {
  this.description = description;  // Descrição pode ser null
}

activate() {
  this.is_active = true;  // Método semântico para ativar
}

deactivate() {
  this.is_active = false;  // Método semântico para desativar
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
│        Category (Aggregate Root)        │
│  ┌──────────────────────────────────┐  │
│  │ category_id: CategoryId        │  │ ← Value Object (identidade)
│  │ name: string                    │  │ ← Atributo simples
│  │ description: string | null      │  │ ← Atributo simples (opcional)
│  │ is_active: boolean              │  │ ← Atributo simples (estado)
│  │ created_at: Date                │  │ ← Atributo simples
│  └──────────────────────────────────┘  │
│                                         │
│  Métodos:                               │
│  - create()                            │
│  - changeName()                        │
│  - changeDescription()                 │
│  - activate()                          │
│  - deactivate()                        │
│  - validate()                          │
└─────────────────────────────────────────┘
           │
           │ usa
           ↓
┌──────────────────────────────┐
│   CategoryId (VO)             │
│  ┌────────────────────────┐  │
│  │ id: string (UUID)      │  │
│  │ - Valida formato UUID  │  │
│  │ - Imutável             │  │
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
| **Exemplo** | `CategoryId` | `Category` |
| **Ciclo de vida** | Criado e descartado | Criado e modificado |

---

## 🏗️ Repository Pattern

**Interface:**
```typescript
export interface ICategoryRepository extends ISearchableRepository<
  Category,           // Agregado
  CategoryId,         // ID (Value Object)
  CategoryFilter,     // Filtros (string)
  CategorySearchParams,
  CategorySearchResult
> {}
```

**Características:**
- ✅ Abstração de persistência
- ✅ Trabalha com agregados completos
- ✅ Contrato independente de implementação
- ✅ Suporta busca e filtros

**Filtro:**
```typescript
export type CategoryFilter = string;  // Filtro simples por nome
```

---

## ✅ Princípios Aplicados

### 1. **Encapsulamento**
```typescript
activate() {
  this.is_active = true;  // Encapsula a lógica de ativação
}

deactivate() {
  this.is_active = false;  // Encapsula a lógica de desativação
}
```

### 2. **Invariantes**
```typescript
static create(props: CategoryCreateCommand): Category {
  const category = new Category(props);
  category.validate(['name']);  // Invariante: nome deve ser válido
  return category;
}
```

### 3. **Validação com Decorators**
```typescript
export class CategoryRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(entity: Category) {
    Object.assign(this, entity);
  }
}
```

**Características:**
- Usa `class-validator` para validações
- Validação por grupos de campos
- Integrado com sistema de notificações

### 4. **Factory Methods**
```typescript
static create(props: CategoryCreateCommand): Category {
  // Factory method para criar categoria válida
}

static fake() {
  return CategoryFakeBuilder;  // Factory para testes
}
```

---

## 🧪 Fake Builder Pattern

**Características:**
- ✅ Builder fluente para criar objetos de teste
- ✅ Valores padrão gerados automaticamente
- ✅ Suporta criação de múltiplas instâncias

**Exemplo de uso:**
```typescript
// Criar uma categoria
const category = Category.fake().aCategory().build();

// Criar categoria com nome específico
const category = Category.fake()
  .aCategory()
  .withName('Action')
  .build();

// Criar categoria desativada
const category = Category.fake()
  .aCategory()
  .deactivate()
  .build();

// Criar múltiplas categorias
const categories = Category.fake()
  .theCategories(5)
  .build();
```

**Métodos disponíveis:**
- `withCategoryId()` - Define ID customizado
- `withName()` - Define nome customizado
- `withDescription()` - Define descrição customizada
- `activate()` - Cria categoria ativa
- `deactivate()` - Cria categoria inativa
- `withCreatedAt()` - Define data de criação
- `withInvalidNameTooLong()` - Cria nome inválido para testes

---

## 🎯 Benefícios

1. **Consistência**: Validações no domínio garantem dados sempre válidos
2. **Testabilidade**: Fake Builder facilita criação de objetos de teste
3. **Manutenibilidade**: Regras de negócio centralizadas no domínio
4. **Expressividade**: Métodos semânticos (`activate()`, `deactivate()`)
5. **Segurança**: Invariantes protegidas pelo agregado
6. **Flexibilidade**: Descrição opcional permite diferentes casos de uso

---

## 🔍 Diferenças em relação ao Cast-Member

| Aspecto | Category | Cast-Member |
|---------|----------|-------------|
| **Value Objects próprios** | Apenas `CategoryId` | `CastMemberType` + `CastMemberId` |
| **Atributos de estado** | `is_active` (boolean) | Não possui |
| **Métodos de estado** | `activate()`, `deactivate()` | Não possui |
| **Descrição** | Opcional (`string \| null`) | Não possui |
| **Validação** | `class-validator` com decorators | Validação customizada |
| **Filtro** | `string` (simples) | `CastMemberFilter` (complexo) |

**Por que essas diferenças?**

- **Category** é uma entidade mais simples, focada em classificação
- **Cast-Member** tem regras de negócio mais complexas (tipo obrigatório)
- Cada agregado reflete as necessidades específicas do seu domínio

---

## 📝 Resumo Prático

- **Value Objects** (`CategoryId`): Imutável, valida formato UUID, igualdade por valor
- **Entities** (`Entity`): Têm identidade, podem mudar ao longo do tempo
- **Aggregates** (`Category`): Raiz que controla acesso e garante consistência
- **Repository** (`ICategoryRepository`): Abstração de persistência
- **Fake Builder** (`CategoryFakeBuilder`): Facilita criação de objetos para testes

---

## 💡 Exemplos de Uso

### Criar uma categoria
```typescript
const category = Category.create({
  name: 'Action',
  description: 'Action movies',
  is_active: true
});
```

### Modificar uma categoria
```typescript
category.changeName('Sci-Fi');
category.changeDescription('Science Fiction movies');
category.deactivate();
```

### Validar categoria
```typescript
category.validate(['name']);  // Valida apenas o nome
category.validate();          // Valida todos os campos
```

### Usar Fake Builder em testes
```typescript
const category = Category.fake()
  .aCategory()
  .withName('Drama')
  .activate()
  .build();
```

---

## 🔗 Referências

- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [Value Objects vs Entities](https://martinfowler.com/bliki/ValueObject.html)
- [Aggregate Pattern](https://martinfowler.com/bliki/DDD_Aggregate.html)
- [Builder Pattern](https://refactoring.guru/design-patterns/builder)
