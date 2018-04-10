function! s:startMarkdownServer()
  let path = expand('%:p')
  echo path
  execute("! vim-markdown-renderer --file ".path)
endfunction

augroup markdownRenderer
  autocmd!
  autocmd FileType markdown,md call StartMarkdownServer()
augroup End
