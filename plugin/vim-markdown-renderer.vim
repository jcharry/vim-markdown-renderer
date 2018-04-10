function! s:start_markdown_server()
  let path = expand('%:p')
  echomsg path
  " execute('! vim-markdown-renderer --file '.path)
endfunction

augroup markdownRenderer
  autocmd!
  autocmd FileType markdown,md call <SID>start_markdown_server()
augroup End

nnoremap <Plug>StartMarkdownServer :<C-U>call <SID>start_markdown_server()<CR>

if !hasmapto('<Plug>StartMarkdownServer', 'n') || maparg('<Leader>zz', 'n') ==# ''
  nmap <Leader>zz <Plug>StartMarkdownServer
endif
