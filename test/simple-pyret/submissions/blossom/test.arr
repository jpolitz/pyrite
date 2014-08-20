import my-gdrive("sort") as S

check:
  S.sort([list: 1, 2, 3]) is [list: 1, 2, 3]
  S.sort([list:]) is [list:]
  S.sort([list: 3, 2, 1]) is [list: 3, 2, 1]
end
