with open("locales/vi/book/23-hoc-ky-nang-gi-dang.md", "r") as f:
    text = f.read()

bad = "；最高人民法院、最高人民检察院 (2019). 关于办理组织考试作弊等刑事案件适用法律若干问题的解释（法释〔2019〕13 号，第一条）. <https://www.spp.gov.cn/spp/xwfbh/wsfbh/201909/t20190903_430901.shtml>：「国家统一法律职业资格考试、国家教师资格考试、注册会计师全国统一考试、会计专业技术资格考试……等专业技术资格考试」；最高人民法院、最高人民检察院 (2019). 关于办理组织考试作弊等刑事案件适用法律若干问题的解释（法释〔2019〕13 号，第一条）. <https://www.spp.gov.cn/spp/xwfbh/wsfbh/201909/t20190903_430901.shtml>：「国家统一法律职业资格考试、国家教师资格考试、注册会计师全国统一考试、会计专业技术资格考试……等专业技术资格考试」"

good = "；最高人民法院、最高人民检察院 (2019). 关于办理组织考试作弊等刑事案件适用法律若干问题的解释（法释〔2019〕13 号，第一条）. <https://www.spp.gov.cn/spp/xwfbh/wsfbh/201909/t20190903_430901.shtml>：「国家统一法律职业资格考试、国家教师资格考试、注册会计师全国统一考试、会计专业技术资格考试……等专业技术资格考试」"

text = text.replace(bad, good)

with open("locales/vi/book/23-hoc-ky-nang-gi-dang.md", "w") as f:
    f.write(text)
