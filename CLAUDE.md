# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DK-Lok 제품 카탈로그 검색 웹사이트. 고객이 Fittings와 Valves 제품 코드를 검색하고, 각 End별로 Connection Type → Thread Type → Thread Spec → Thread Size를 선택할 수 있는 사이트.

## Commands

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

## Architecture

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: MSSQL (mssql 패키지 사용)

### Key Files

- `src/lib/db.ts` - MSSQL 데이터베이스 연결 및 쿼리 유틸리티
- `src/app/page.tsx` - 메인 검색 페이지 (Client Component)
- `src/components/EndConnectionSelector.tsx` - End별 4단계 선택 컴포넌트

### API Endpoints

- `GET /api/products?q={검색어}&category={Fittings|Valves}` - 제품 검색
- `GET /api/materials` - 재질 목록
- `GET /api/connection-types` - Connection Type 목록
- `GET /api/thread-types?connectionTypeCode={code}` - Thread Type 목록
- `GET /api/thread-specs?threadTypeCode={code}` - Thread Spec 목록
- `GET /api/thread-sizes?threadSpecCode={code}` - Thread Size 목록

### Database (MSSQL - DK_NG)

연결 정보: `.env.local` (DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT)

**테이블 관계:**
```
BK_ProductGroup (502건) - 제품 시리즈
  └─ EndNum: Connection 선택기 개수

b_MaterialGroup (12건) - 재질 (Stainless steel, Aluminum, Brass 등)

A_ConnectionType (14건) - THREAD, DK-LOK Type, BITE THREAD 등
    ↓ connectionTypeCode
A_ThreadType (37건) - PT Male Thread, NPT Female Thread 등
    ↓ threadTypeCode
A_ThreadSpec (240건) - NPT (Standard), NPT (10,000psig) 등
    ↓ threadSpecCode
A_ThreadSize (1,837건) - 1/4", 1/2" 등 + degignator
```

## Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Access to MSSQL database at 192.168.1.11:2433

### Quick Start

1. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Access the application:
   ```
   http://localhost:8070
   ```

5. Stop the application:
   ```bash
   docker-compose down
   ```

### Production Deployment

1. Build the Docker image:
   ```bash
   docker build -t dklok-products:latest .
   ```

2. Check image size (should be ~200-300MB):
   ```bash
   docker images | grep dklok-products
   ```

3. Run the container:
   ```bash
   docker run -d \
     --name dklok-products \
     -p 8070:8070 \
     -e DB_SERVER=192.168.1.11 \
     -e DB_USER=dkenterb \
     -e DB_PASSWORD=your_password \
     -e DB_DATABASE=DK_NG \
     -e DB_PORT=2433 \
     dklok-products:latest
   ```

4. Check health status:
   ```bash
   docker ps
   docker inspect --format='{{json .State.Health}}' dklok-products
   ```

### Verification

**Test API endpoint:**
```bash
curl http://localhost:3000/api/products?q=test&category=Fittings
```

**Test main page:**
```bash
curl http://localhost:8070/
```

**Verify database connection (check logs):**
```bash
docker-compose logs -f | grep -i error
```

### Troubleshooting

#### Database connection fails

**Error**: `Connection timeout` or `Login failed`

**Solution**:
- Verify database credentials in `.env` file
- Ensure container can reach 192.168.1.11:2433
- Check firewall rules allow connection from container IP
- Verify MSSQL server is running and accessible

```bash
# Test network connectivity
docker-compose exec app ping 192.168.1.11
```

#### Build fails on mssql package

**Error**: `node-gyp ERR!` or `native module` errors

**Solution**:
- Ensure using Debian-based image (not Alpine)
- Verify Node.js version 20.x
- Check Docker has sufficient disk space

```bash
# View build output
docker build -t dklok-products:latest . --progress=plain
```

#### Port 3000 already in use

**Error**: `port 3000 is already allocated`

**Solution**:
1. Stop existing Next.js dev server:
   ```bash
   pkill -f "next dev"
   ```

2. Or change port mapping in `docker-compose.yml`:
   ```yaml
   ports:
     - "8071:8070"
   ```

3. Or stop conflicting container:
   ```bash
   docker stop $(docker ps -q)
   ```

#### Image size is too large

**Current**: ~250MB (optimized with standalone output)

**Optimization tips**:
- Verify `.dockerignore` excludes node_modules and .next
- Check Dockerfile multi-stage build is working correctly
- Use `docker history` to analyze layer sizes

```bash
docker history dklok-products:latest
```

### Development Mode (Optional)

For local development with hot reload:
```bash
npm install
npm run dev
# Access at http://localhost:3000 (or http://localhost:8070 in Docker)
```

For Docker-based development (requires more resources):
```bash
docker-compose -f docker-compose.dev.yml up
```

### Security Notes

- Container runs as non-root user `nextjs`
- Database credentials are injected at runtime (not baked into image)
- Use environment variables for sensitive data
- Never commit `.env` file (already in `.gitignore`)

### Performance Tips

- **Startup time**: Container should be ready in 30-40 seconds
- **Memory usage**: Typical 100-150MB
- **CPU usage**: Minimal when idle

Monitor with:
```bash
docker stats dklok-products --no-stream
```
